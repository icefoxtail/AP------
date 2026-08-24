using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Printing;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

internal static class Program
{
    private const int DefaultPort = 43191;
    private const string DefaultPrinter = "SINDOH N500 Series PCL";
    private const long MaxBodyBytes = 256L * 1024L * 1024L;

    private static void Main(string[] args)
    {
        var port = ReadIntArgument(args, "--port", DefaultPort);
        var printer = ReadStringArgument(args, "--printer", DefaultPrinter);
        var prefix = "http://127.0.0.1:" + port + "/";

        using (var listener = new HttpListener())
        {
            listener.Prefixes.Add(prefix);
            listener.Start();
            Console.WriteLine("AP Math native print agent listening on " + prefix);
            Console.WriteLine("RAW printer: " + printer);
            Console.WriteLine("Press Ctrl+C to stop.");

            Console.CancelKeyPress += delegate(object sender, ConsoleCancelEventArgs eventArgs)
            {
                eventArgs.Cancel = true;
                listener.Stop();
            };

            while (listener.IsListening)
            {
                try
                {
                    HandleRequest(listener.GetContext(), printer);
                }
                catch (HttpListenerException)
                {
                    break;
                }
                catch (ObjectDisposedException)
                {
                    break;
                }
                catch (Exception error)
                {
                    Console.Error.WriteLine("Request error: " + error);
                }
            }
        }
    }

    private static void HandleRequest(HttpListenerContext context, string configuredPrinter)
    {
        var response = context.Response;
        AddCorsHeaders(context.Request, response);
        try
        {
            if (context.Request.HttpMethod.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            {
                response.StatusCode = 204;
                return;
            }

            var path = context.Request.Url == null ? string.Empty : context.Request.Url.AbsolutePath.TrimEnd('/');
            if (context.Request.HttpMethod.Equals("GET", StringComparison.OrdinalIgnoreCase) && path == "/health")
            {
                WriteJson(response, "{\"ok\":true,\"printer\":\"" + JsonEscape(configuredPrinter) + "\",\"protocol\":\"pcl5-raster-1bpp,gdi-devmode\"}", 200);
                return;
            }

            if (!context.Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
                (path != "/print" && path != "/print-gdi"))
            {
                WriteJson(response, "{\"ok\":false,\"error\":\"Not found\"}", 404);
                return;
            }

            var requestedPrinter = context.Request.Headers["X-AP-Printer"];
            if (!string.IsNullOrWhiteSpace(requestedPrinter) &&
                !requestedPrinter.Equals(configuredPrinter, StringComparison.OrdinalIgnoreCase))
            {
                WriteJson(response, "{\"ok\":false,\"error\":\"Printer is not allowed by this agent.\"}", 403);
                return;
            }

            if (context.Request.ContentLength64 == 0 || context.Request.ContentLength64 > MaxBodyBytes)
            {
                WriteJson(response, "{\"ok\":false,\"error\":\"Invalid print payload size.\"}", 413);
                return;
            }

            var documentName = SanitizeDocumentName(context.Request.Headers["X-AP-Document-Name"]);
            var payload = ReadBody(context.Request.InputStream);
            var started = DateTime.UtcNow;
            if (path == "/print-gdi")
            {
                var gdiPayload = GdiPrintPayload.Parse(payload);
                GdiPrinter.Print(configuredPrinter, documentName, gdiPayload.Pages, gdiPayload.Dpi, gdiPayload.Duplex);
            }
            else
            {
                RawPrinter.SendBytes(configuredPrinter, documentName, payload);
            }
            var elapsedMs = (DateTime.UtcNow - started).TotalMilliseconds;
            Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss.fff") + "] printed " + documentName + " via " + (path == "/print-gdi" ? "GDI/DEVMODE" : "RAW PCL") + " (" + payload.Length + " bytes, " + Math.Round(elapsedMs) + " ms)");
            WriteJson(response, "{\"ok\":true,\"printer\":\"" + JsonEscape(configuredPrinter) + "\",\"documentName\":\"" + JsonEscape(documentName) + "\",\"bytes\":" + payload.Length + ",\"sendElapsedMs\":" + elapsedMs.ToString(System.Globalization.CultureInfo.InvariantCulture) + "}", 200);
        }
        catch (Exception error)
        {
            Console.Error.WriteLine("Native print error: " + error);
            try
            {
                WriteJson(response, "{\"ok\":false,\"error\":\"" + JsonEscape(error.Message) + "\"}", 500);
            }
            catch
            {
                response.StatusCode = 500;
            }
        }
        finally
        {
            response.Close();
        }
    }

    private static byte[] ReadBody(Stream stream)
    {
        using (var buffer = new MemoryStream())
        {
            var chunk = new byte[1024 * 1024];
            var total = 0L;
            int read;
            while ((read = stream.Read(chunk, 0, chunk.Length)) > 0)
            {
                total += read;
                if (total > MaxBodyBytes) throw new InvalidOperationException("Print payload is too large.");
                buffer.Write(chunk, 0, read);
            }
            return buffer.ToArray();
        }
    }

    private static void AddCorsHeaders(HttpListenerRequest request, HttpListenerResponse response)
    {
        response.Headers["Access-Control-Allow-Origin"] = request.Headers["Origin"] ?? "*";
        response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
        response.Headers["Access-Control-Allow-Headers"] = "Content-Type, X-AP-Printer, X-AP-Document-Name";
        response.Headers["Access-Control-Max-Age"] = "60";
    }

    private static void WriteJson(HttpListenerResponse response, string json, int status)
    {
        var bytes = Encoding.UTF8.GetBytes(json);
        response.StatusCode = status;
        response.ContentType = "application/json; charset=utf-8";
        response.ContentLength64 = bytes.Length;
        response.OutputStream.Write(bytes, 0, bytes.Length);
    }

    private static string SanitizeDocumentName(string value)
    {
        var name = string.IsNullOrWhiteSpace(value) ? "AP Math Native PCL Print" : value.Trim();
        var invalid = Path.GetInvalidFileNameChars();
        var builder = new StringBuilder(name.Length);
        foreach (var character in name)
        {
            builder.Append(Array.IndexOf(invalid, character) >= 0 ? '_' : character);
        }
        return builder.ToString().Substring(0, Math.Min(builder.Length, 120));
    }

    private static string JsonEscape(string value)
    {
        return value.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "\\r").Replace("\n", "\\n");
    }

    private static int ReadIntArgument(string[] args, string name, int fallback)
    {
        int value;
        return int.TryParse(ReadStringArgument(args, name, string.Empty), out value) && value > 0 && value < 65536 ? value : fallback;
    }

    private static string ReadStringArgument(string[] args, string name, string fallback)
    {
        for (var index = 0; index < args.Length - 1; index++)
        {
            if (args[index].Equals(name, StringComparison.OrdinalIgnoreCase)) return args[index + 1];
        }
        return fallback;
    }
}

// Browser-to-agent framing for the driver-backed print path.
// Header: 8-byte ASCII magic, uint32 DPI, uint32 page count,
// followed by repeated uint32 PNG length + PNG bytes.
internal sealed class GdiPrintPayload
{
    private const string Magic = "APGDI001";
    private const int HeaderSize = 16;
    private const int MaxPages = 200;
    private const int MaxPageBytes = 64 * 1024 * 1024;

    public readonly int Dpi;
    public readonly bool Duplex;
    public readonly List<byte[]> Pages;

    private GdiPrintPayload(int dpi, bool duplex, List<byte[]> pages)
    {
        Dpi = dpi;
        Duplex = duplex;
        Pages = pages;
    }

    public static GdiPrintPayload Parse(byte[] payload)
    {
        if (payload == null || payload.Length < HeaderSize) throw new InvalidDataException("GDI 인쇄 데이터가 너무 짧습니다.");
        var magic = Encoding.ASCII.GetString(payload, 0, 8);
        if (!magic.Equals(Magic, StringComparison.Ordinal)) throw new InvalidDataException("GDI 인쇄 데이터 형식이 올바르지 않습니다.");

        var dpi = ReadInt32(payload, 8);
        var pageCountAndFlags = ReadInt32(payload, 12);
        var duplex = (pageCountAndFlags & unchecked((int)0x80000000)) != 0;
        var pageCount = pageCountAndFlags & 0x7fffffff;
        if (dpi < 72 || dpi > 1200) throw new InvalidDataException("지원하지 않는 GDI 인쇄 해상도입니다.");
        if (pageCount < 1 || pageCount > MaxPages) throw new InvalidDataException("GDI 인쇄 페이지 수가 올바르지 않습니다.");

        var pages = new List<byte[]>(pageCount);
        var offset = HeaderSize;
        for (var index = 0; index < pageCount; index += 1)
        {
            if (offset + 4 > payload.Length) throw new InvalidDataException("GDI 인쇄 페이지 길이가 없습니다.");
            var pageBytes = ReadInt32(payload, offset);
            offset += 4;
            if (pageBytes < 16 || pageBytes > MaxPageBytes || offset + pageBytes > payload.Length)
            {
                throw new InvalidDataException("GDI 인쇄 페이지 데이터가 올바르지 않습니다.");
            }
            var page = new byte[pageBytes];
            Buffer.BlockCopy(payload, offset, page, 0, pageBytes);
            pages.Add(page);
            offset += pageBytes;
        }
        if (offset != payload.Length) throw new InvalidDataException("GDI 인쇄 데이터 뒤에 불필요한 데이터가 있습니다.");
        return new GdiPrintPayload(dpi, duplex, pages);
    }

    private static int ReadInt32(byte[] bytes, int offset)
    {
        return bytes[offset]
            | (bytes[offset + 1] << 8)
            | (bytes[offset + 2] << 16)
            | (bytes[offset + 3] << 24);
    }
}

internal static class GdiPrinter
{
    public static void Print(string printerName, string documentName, List<byte[]> pages, int sourceDpi, bool duplex)
    {
        if (pages == null || pages.Count == 0) throw new InvalidOperationException("GDI 인쇄할 페이지가 없습니다.");

        using (var document = new PrintDocument())
        {
            document.DocumentName = documentName;
            document.PrintController = new StandardPrintController();
            document.PrinterSettings.PrinterName = printerName;
            if (!document.PrinterSettings.IsValid) throw new InvalidPrinterException(document.PrinterSettings);

            // This property is translated by the installed driver into its DEVMODE.
            // The explicit DEVMODE round-trip below makes the setting observable and
            // prevents the queue's OneSided default from silently winning.
            document.PrinterSettings.Duplex = duplex ? Duplex.Vertical : Duplex.Simplex;
            SetA4(document.PrinterSettings);
            using (var devMode = DriverDevMode.Apply(document.PrinterSettings, duplex))
            {
                Console.WriteLine("GDI/DEVMODE: source " + sourceDpi + "dpi, duplex=" + document.PrinterSettings.Duplex + ", paper=" + document.DefaultPageSettings.PaperSize.Kind);
                var pageIndex = 0;
                document.PrintPage += delegate(object sender, PrintPageEventArgs e)
                {
                    using (var stream = new MemoryStream(pages[pageIndex], false))
                    using (var image = Image.FromStream(stream, true, true))
                    {
                        DrawToImageableArea(e, image, pageIndex == 0);
                    }
                    pageIndex += 1;
                    e.HasMorePages = pageIndex < pages.Count;
                };
                document.Print();
            }
        }
    }

    private static void SetA4(PrinterSettings settings)
    {
        foreach (PaperSize paperSize in settings.PaperSizes)
        {
            if (paperSize.Kind == PaperKind.A4)
            {
                settings.DefaultPageSettings.PaperSize = paperSize;
                return;
            }
        }
    }

    private static void DrawToImageableArea(PrintPageEventArgs e, Image image, bool logBounds)
    {
        // PrintDocument's Graphics is already translated to the driver's
        // imageable origin. Its clip bounds therefore start at (0, 0), while
        // PageSettings.PrintableArea is expressed in full-page coordinates.
        // Drawing PrintableArea directly would add the left/top hard margin a
        // second time and clip the right/bottom edge.
        var printable = e.PageSettings.PrintableArea;
        var clip = e.Graphics.VisibleClipBounds;
        var target = clip;
        if (target.Width <= 0 || target.Height <= 0)
        {
            target = new RectangleF(0, 0, printable.Width, printable.Height);
        }
        if (logBounds)
        {
            Console.WriteLine("GDI bounds: page=" + e.PageBounds + ", printable=" + printable + ", clip=" + clip + ", target=" + target);
        }
        var graphics = e.Graphics;
        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        graphics.CompositingQuality = CompositingQuality.HighQuality;
        graphics.DrawImage(image, target);
    }
}

internal sealed class DriverDevMode : IDisposable
{
    private const int DmFieldsOffset = 72;
    private const int DmDuplexOffset = 94;
    private const int DmDuplexFlag = 0x1000;
    private const short DmDupSimplex = 1;
    private const short DmDupVertical = 2;

    private readonly IntPtr handle;

    private DriverDevMode(IntPtr handle)
    {
        this.handle = handle;
    }

    public static DriverDevMode Apply(PrinterSettings settings, bool duplex)
    {
        var handle = settings.GetHdevmode();
        if (handle == IntPtr.Zero) throw new InvalidOperationException("프린터 DEVMODE를 가져오지 못했습니다.");
        try
        {
            var pointer = GlobalLock(handle);
            if (pointer == IntPtr.Zero) throw new Win32Exception(Marshal.GetLastWin32Error(), "GlobalLock(DEVMODE) failed");
            try
            {
                var fields = Marshal.ReadInt32(pointer, DmFieldsOffset);
                Marshal.WriteInt32(pointer, DmFieldsOffset, fields | DmDuplexFlag);
                Marshal.WriteInt16(pointer, DmDuplexOffset, duplex ? DmDupVertical : DmDupSimplex);
            }
            finally
            {
                GlobalUnlock(handle);
            }
            settings.SetHdevmode(handle);
            return new DriverDevMode(handle);
        }
        catch
        {
            GlobalFree(handle);
            throw;
        }
    }

    public void Dispose()
    {
        if (handle != IntPtr.Zero) GlobalFree(handle);
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern IntPtr GlobalLock(IntPtr hMem);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool GlobalUnlock(IntPtr hMem);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern IntPtr GlobalFree(IntPtr hMem);
}

internal static class RawPrinter
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private sealed class DocInfo
    {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName = string.Empty;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile = null;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType = "RAW";
    }

    [DllImport("winspool.drv", EntryPoint = "OpenPrinterW", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern bool OpenPrinter(string printerName, out IntPtr printerHandle, IntPtr defaults);

    [DllImport("winspool.drv", EntryPoint = "ClosePrinter", SetLastError = true)]
    private static extern bool ClosePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", EntryPoint = "StartDocPrinterW", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern int StartDocPrinter(IntPtr printerHandle, int level, [In] DocInfo documentInfo);

    [DllImport("winspool.drv", EntryPoint = "EndDocPrinter", SetLastError = true)]
    private static extern bool EndDocPrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", EntryPoint = "StartPagePrinter", SetLastError = true)]
    private static extern bool StartPagePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", EntryPoint = "EndPagePrinter", SetLastError = true)]
    private static extern bool EndPagePrinter(IntPtr printerHandle);

    [DllImport("winspool.drv", EntryPoint = "WritePrinter", SetLastError = true)]
    private static extern bool WritePrinter(IntPtr printerHandle, byte[] data, int count, out int written);

    public static void SendBytes(string printerName, string documentName, byte[] data)
    {
        IntPtr handle;
        if (!OpenPrinter(printerName, out handle, IntPtr.Zero)) ThrowLastWin32Error("OpenPrinter");
        var documentStarted = false;
        var pageStarted = false;
        try
        {
            var info = new DocInfo { pDocName = documentName, pDataType = "RAW" };
            if (StartDocPrinter(handle, 1, info) == 0) ThrowLastWin32Error("StartDocPrinter");
            documentStarted = true;
            if (!StartPagePrinter(handle)) ThrowLastWin32Error("StartPagePrinter");
            pageStarted = true;

            const int chunkSize = 1024 * 1024;
            for (var offset = 0; offset < data.Length; offset += chunkSize)
            {
                var length = Math.Min(chunkSize, data.Length - offset);
                var chunk = new byte[length];
                Buffer.BlockCopy(data, offset, chunk, 0, length);
                int written;
                if (!WritePrinter(handle, chunk, length, out written) || written != length) ThrowLastWin32Error("WritePrinter");
            }
        }
        finally
        {
            if (pageStarted) EndPagePrinter(handle);
            if (documentStarted) EndDocPrinter(handle);
            ClosePrinter(handle);
        }
    }

    private static void ThrowLastWin32Error(string operation)
    {
        throw new Win32Exception(Marshal.GetLastWin32Error(), operation + " failed");
    }
}

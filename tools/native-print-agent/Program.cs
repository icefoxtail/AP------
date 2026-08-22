using System;
using System.ComponentModel;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;

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
                WriteJson(response, "{\"ok\":true,\"printer\":\"" + JsonEscape(configuredPrinter) + "\",\"protocol\":\"pcl5-raster-1bpp\"}", 200);
                return;
            }

            if (!context.Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase) || path != "/print")
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
            RawPrinter.SendBytes(configuredPrinter, documentName, payload);
            var elapsedMs = (DateTime.UtcNow - started).TotalMilliseconds;
            Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss.fff") + "] printed " + documentName + " (" + payload.Length + " bytes, " + Math.Round(elapsedMs) + " ms)");
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

# 인쇄가 "스풀링 중"에서 안 넘어갈 때 복구용.
#   powershell -ExecutionPolicy Bypass -File tools\fix-print-queue.ps1
#
# 원인: Edge가 인쇄 미리보기 PDF를 프린터 드라이버용 EMF로 바꾸는 별도 프로세스
# (msedge.exe --utility-sub-type=printing.mojom.PrintingService, sandbox=pdf_conversion)가
# 가끔 무한 루프에 빠진다. 이 프로세스가 스풀 파일을 붙잡고 있어 취소도 안 되고,
# 뒤따르는 인쇄 잡까지 전부 0바이트로 큐에 쌓인다. 프로세스를 죽이면 큐가 풀린다.

$printer = if ($args[0]) { $args[0] } else { "SINDOH N500 Series PCL" }

# 1) 물려 있는 Edge EMF 변환 프로세스 종료
$conv = Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" |
        Where-Object { $_.CommandLine -match 'pdf_conversion' }
if ($conv) {
    foreach ($c in $conv) {
        $p = Get-Process -Id $c.ProcessId -ErrorAction SilentlyContinue
        Write-Host ("변환 프로세스 종료: PID {0} (CPU {1:N0}초)" -f $c.ProcessId, $p.CPU)
        Stop-Process -Id $c.ProcessId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
} else {
    Write-Host "물려 있는 Edge 변환 프로세스 없음"
}

# 2) 남은 잡 제거
Get-PrintJob -PrinterName $printer -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host ("잡 삭제: {0} ({1}, {2} bytes)" -f $_.Id, $_.JobStatus, $_.Size)
    Remove-PrintJob -PrinterName $printer -ID $_.Id -ErrorAction SilentlyContinue
}

# 3) 큐 일시중지 해제
$wmi = Get-WmiObject Win32_Printer -Filter "Name='$printer'"
if ($wmi) { [void]$wmi.Resume() }

Start-Sleep -Seconds 2
$wmi = Get-WmiObject Win32_Printer -Filter "Name='$printer'"
$state = $wmi.PrinterState   # 0 = 정상, 1비트 = 일시중지
$jobs = (Get-Printer -Name $printer).JobCount
Write-Host ""
Write-Host ("결과: PrinterState={0} JobCount={1}" -f $state, $jobs)
if ($state -eq 0 -and $jobs -eq 0) {
    Write-Host "큐 정상. 다시 인쇄하면 됩니다."
} else {
    Write-Host "아직 안 풀렸으면 관리자 권한 PowerShell에서: net stop spooler; del /q C:\Windows\System32\spool\PRINTERS\*; net start spooler"
}

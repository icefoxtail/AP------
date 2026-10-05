# SINDOH N500 PS 드라이버로 프린터를 등록하고 기본으로 잡는다 (다른 PC용).
# 아카이브 인쇄 무한 스풀링은 PCL 드라이버가 원인 → PS로 인쇄하면 해결.
#
# 사용: 관리자 PowerShell에서
#   powershell -ExecutionPolicy Bypass -File tools\setup-sindoh-ps.ps1
#
# 전제: 그 PC에 "SINDOH N500 Series PS" 드라이버가 설치돼 있어야 함.
#   (PCL이 이미 있으면 SINDOH N500 드라이버 패키지 재설치 시 PS 선택하면 함께 깔림.
#    없으면 sindoh.com 지원에서 N500 x64 드라이버 먼저 설치.)

$ip        = "192.168.219.200"       # 프린터 IP (환경에 맞게 수정)
$driver    = "SINDOH N500 Series PS"
$portName  = "IP_${ip}_9100"          # Raw 9100 포트 (LPR보다 안정적)
$printer   = "SINDOH N500 Series PS"

# 1) PS 드라이버 존재 확인
$drv = Get-PrinterDriver -Name "$driver*" -ErrorAction SilentlyContinue
if (-not $drv) {
    Write-Host "[중단] '$driver' 드라이버가 이 PC에 없습니다." -ForegroundColor Red
    Write-Host "       SINDOH N500 드라이버 패키지를 설치하면서 'PS'를 선택해 먼저 설치하세요."
    Write-Host "       (다운로드: sindoh.com 지원 → N500 → Windows x64)"
    exit 1
}
Write-Host "드라이버 확인: $($drv.Name)"

# 2) Raw 9100 포트 생성 (없으면)
if (-not (Get-PrinterPort -Name $portName -ErrorAction SilentlyContinue)) {
    Add-PrinterPort -Name $portName -PrinterHostAddress $ip -PortNumber 9100
    Write-Host "포트 생성: $portName (Raw 9100)"
} else {
    Write-Host "포트 이미 있음: $portName"
}

# 3) 프린터 등록 (없으면)
if (-not (Get-Printer -Name $printer -ErrorAction SilentlyContinue)) {
    Add-Printer -Name $printer -DriverName $driver -PortName $portName
    Write-Host "프린터 등록: $printer"
} else {
    # 이미 있으면 포트만 Raw 9100으로 맞춤
    Set-Printer -Name $printer -PortName $portName
    Write-Host "프린터 이미 있음 → 포트를 $portName 로 설정"
}

# 4) 기본 프린터로
(New-Object -ComObject WScript.Network).SetDefaultPrinter($printer)
Start-Sleep -Seconds 1

# 5) 확인
$def = (Get-CimInstance Win32_Printer | Where-Object { $_.Default }).Name
Write-Host ""
Write-Host "완료. 기본 프린터 = $def" -ForegroundColor Green
Write-Host "이제 브라우저에서 그냥 인쇄하면 PS로 나갑니다 (PCL 스풀링 멈춤 회피)."

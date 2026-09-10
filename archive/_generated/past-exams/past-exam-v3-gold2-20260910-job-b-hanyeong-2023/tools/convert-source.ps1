$ErrorActionPreference = 'Stop'
$jobRoot = Join-Path (Get-Location) 'archive/_generated/past-exams/past-exam-v3-gold2-20260910-job-b-hanyeong-2023'
$src = 'D:\기출\23,24 고1\2023년\2학기 기말고사\수학 하 (23 한영고 기말) 답X.hwp'
$out = Join-Path $jobRoot 'source/fresh-original.pdf'
$log = Join-Path $jobRoot 'reports/hwp-conversion.log'
try {
  'CREATE_NEW_HWP_OBJECT' | Out-File $log -Encoding utf8
  $hwpJobB = New-Object -ComObject HWPFrame.HwpObject
  $hwpJobB.XHwpWindows.Item(0).Visible = $false
  'OBJECT_CREATED' | Add-Content $log
  $opened = $hwpJobB.Open($src, 'HWP', 'forceopen:true')
  "OPEN_RESULT=$opened" | Add-Content $log
  if (-not $opened) { throw 'HWP_OPEN_FAILED' }
  $saved = $hwpJobB.SaveAs($out, 'PDF', '')
  "SAVE_PDF_RESULT=$saved" | Add-Content $log
  if (-not $saved) { throw 'HWP_PDF_EXPORT_FAILED' }
  $hwpJobB.Clear(1)
  $hwpJobB.Quit()
} catch {
  $_.Exception.Message | Add-Content $log
  throw
}

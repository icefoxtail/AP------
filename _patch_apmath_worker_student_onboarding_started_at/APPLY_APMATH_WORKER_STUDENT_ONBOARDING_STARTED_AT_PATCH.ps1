param(
  [switch]$Deploy,
  [string]$VerifyStudentId = 's16'
)

$ErrorActionPreference = 'Stop'
$Root = (Get-Location).Path
$WorkerDir = Join-Path $Root 'apmath\worker-backup\worker'
$StudentRoute = Join-Path $WorkerDir 'routes\students.js'
$IndexFile = Join-Path $WorkerDir 'index.js'
$FrontStudent = Join-Path $Root 'apmath\js\student.js'

if (!(Test-Path $StudentRoute)) {
  throw "대상 파일 없음: $StudentRoute`n실행 위치가 repo root인지 확인하세요: C:\Users\USER\Desktop\AP------"
}
if (!(Test-Path $IndexFile)) {
  throw "Worker index.js 없음: $IndexFile"
}

$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = "$StudentRoute.bak_apmath_onboarding_started_at_$stamp"
Copy-Item $StudentRoute $backup -Force
Write-Host "[backup] $backup"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$raw = [System.IO.File]::ReadAllText($StudentRoute, $utf8NoBom)
$text = $raw -replace "`r`n", "`n"

$patchCount = 0
$skipCount = 0

function Replace-Or-Skip {
  param(
    [string]$Old,
    [string]$New,
    [string]$Label
  )

  if ($script:text.Contains($New)) {
    $script:skipCount += 1
    Write-Host "[skip] already patched: $Label"
    return
  }

  if (!$script:text.Contains($Old)) {
    throw @"
패턴을 찾지 못했습니다: $Label
백업은 보존했습니다: $script:backup

이 파일이 많이 바뀐 상태입니다.
학생 저장 route 파일을 확인해야 합니다:
$script:StudentRoute
"@
  }

  $script:text = $script:text.Replace($Old, $New)
  $script:patchCount += 1
  Write-Host "[patch] $Label"
}

Replace-Or-Skip @'
    studentAddress: String(d.student_address ?? d.studentAddress ?? current.student_address ?? '').trim(),
    vehicleInfo: String(d.vehicle_info ?? d.vehicleInfo ?? current.vehicle_info ?? '').trim(),
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
'@ @'
    studentAddress: String(d.student_address ?? d.studentAddress ?? current.student_address ?? '').trim(),
    vehicleInfo: String(d.vehicle_info ?? d.vehicleInfo ?? current.vehicle_info ?? '').trim(),
    onboardingStartedAt: String(d.onboarding_started_at ?? d.onboardingStartedAt ?? current.onboarding_started_at ?? '').trim(),
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
'@ 'normalizeStudentPayload: onboardingStartedAt 수신'

Replace-Or-Skip @'
          student_phone, parent_phone, student_address, vehicle_info, student_pin,
          high_subjects, student_identity_key, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, '재원', ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
'@ @'
          student_phone, parent_phone, student_address, vehicle_info, onboarding_started_at, student_pin,
          high_subjects, student_identity_key, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, '재원', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
'@ 'INSERT students: onboarding_started_at 컬럼/placeholder 추가'

Replace-Or-Skip @'
        d.studentAddress,
        d.vehicleInfo,
        pin,
'@ @'
        d.studentAddress,
        d.vehicleInfo,
        d.onboardingStartedAt,
        pin,
'@ 'INSERT bind: onboardingStartedAt 추가'

Replace-Or-Skip @'
          guardian_relation = ?, student_phone = ?, parent_phone = ?,
          student_address = ?, vehicle_info = ?, student_pin = ?, high_subjects = ?,
          student_identity_key = ?, updated_at = DATETIME('now')
'@ @'
          guardian_relation = ?, student_phone = ?, parent_phone = ?,
          student_address = ?, vehicle_info = ?, onboarding_started_at = ?, student_pin = ?, high_subjects = ?,
          student_identity_key = ?, updated_at = DATETIME('now')
'@ 'UPDATE students: onboarding_started_at 저장 추가'

Replace-Or-Skip @'
      d.studentAddress,
      d.vehicleInfo,
      d.studentPin,
'@ @'
      d.studentAddress,
      d.vehicleInfo,
      d.onboardingStartedAt,
      d.studentPin,
'@ 'UPDATE bind: onboardingStartedAt 추가'

if (!$text.Contains('onboarding_started_at = ?')) {
  throw "패치 검증 실패: UPDATE students에 onboarding_started_at = ?가 없습니다."
}
if (!$text.Contains('onboardingStartedAt: String(d.onboarding_started_at ?? d.onboardingStartedAt ?? current.onboarding_started_at ??')) {
  throw "패치 검증 실패: payload normalize에 onboardingStartedAt가 없습니다."
}

[System.IO.File]::WriteAllText($StudentRoute, $text, $utf8NoBom)
Write-Host "[write] $StudentRoute"
Write-Host "[result] patch=$patchCount skip=$skipCount"

Write-Host "`n[check] node --check routes\students.js"
node --check $StudentRoute

Write-Host "`n[check] node --check worker index.js"
node --check $IndexFile

if (Test-Path $FrontStudent) {
  $front = [System.IO.File]::ReadAllText($FrontStudent, $utf8NoBom)
  if ($front -notmatch 'onboarding_started_at' -or $front -notmatch 'onboardingStartedAt') {
    Write-Warning "프론트 student.js에서 onboarding_started_at/onboardingStartedAt 흔적이 약합니다. 그래도 Worker 패치는 완료되었습니다."
  } else {
    Write-Host "[check] frontend student.js payload marker OK"
  }
}

if ($Deploy) {
  Write-Host "`n[deploy] ap-math-os-v2612"
  Push-Location $WorkerDir
  try {
    npx wrangler@latest deploy --config .\wrangler.jsonc
  } finally {
    Pop-Location
  }

  if ($VerifyStudentId) {
    Write-Host "`n[verify] DB value for $VerifyStudentId"
    npx wrangler@latest d1 execute ap-math-os --remote --command "SELECT id, name, grade, onboarding_started_at FROM students WHERE id='$VerifyStudentId';"
  }
}

Write-Host "`n[DONE] Worker students PATCH/INSERT now supports students.onboarding_started_at."
Write-Host "브라우저 Ctrl+F5 후 등원일 수정 저장 → DB 조회로 확인하세요."

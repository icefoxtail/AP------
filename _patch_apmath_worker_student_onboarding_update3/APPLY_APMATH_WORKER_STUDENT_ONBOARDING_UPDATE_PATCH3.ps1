
param(
  [switch]$Deploy,
  [string]$VerifyStudentId = 's16'
)

$ErrorActionPreference = 'Stop'
$Root = (Get-Location).Path
$WorkerDir = Join-Path $Root 'apmath\worker-backup\worker'
$StudentRoute = Join-Path $WorkerDir 'routes\students.js'
$IndexFile = Join-Path $WorkerDir 'index.js'

if (!(Test-Path $StudentRoute)) {
  throw "Target file not found: $StudentRoute"
}
if (!(Test-Path $IndexFile)) {
  throw "Worker index.js not found: $IndexFile"
}

$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = "$StudentRoute.bak_onboarding_update_patch3_$stamp"
Copy-Item $StudentRoute $backup -Force
Write-Host "[backup] $backup"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$text = [System.IO.File]::ReadAllText($StudentRoute, $utf8NoBom) -replace "`r`n", "`n"
$orig = $text

function Replace-Exact-Required {
  param([string]$Old, [string]$New, [string]$Label)
  if ($script:text.Contains($New)) {
    Write-Host "[skip] $Label already patched"
    return
  }
  if (!$script:text.Contains($Old)) {
    throw "Required pattern not found: $Label"
  }
  $script:text = $script:text.Replace($Old, $New)
  Write-Host "[patch] $Label"
}

function Replace-Regex-Required {
  param([string]$Pattern, [string]$Replacement, [string]$Label)
  if ($script:text -match 'onboarding_started_at\s*=\s*\?') {
    Write-Host "[skip] $Label already patched"
    return
  }
  $newText = [regex]::Replace($script:text, $Pattern, $Replacement, 1)
  if ($newText -eq $script:text) {
    throw "Required regex pattern not found: $Label"
  }
  $script:text = $newText
  Write-Host "[patch] $Label"
}

# 1) Accept onboarding date from request payload while preserving old value when omitted.
if ($text -notmatch 'onboardingStartedAt\s*:') {
  $oldPayload = @'
    studentAddress: String(d.student_address ?? d.studentAddress ?? current.student_address ?? '').trim(),
    vehicleInfo: String(d.vehicle_info ?? d.vehicleInfo ?? current.vehicle_info ?? '').trim(),
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
'@
  $newPayload = @'
    studentAddress: String(d.student_address ?? d.studentAddress ?? current.student_address ?? '').trim(),
    vehicleInfo: String(d.vehicle_info ?? d.vehicleInfo ?? current.vehicle_info ?? '').trim(),
    onboardingStartedAt: String(d.onboarding_started_at ?? d.onboardingStartedAt ?? current.onboarding_started_at ?? '').trim(),
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
'@
  Replace-Exact-Required $oldPayload $newPayload 'payload normalize onboardingStartedAt'
} else {
  Write-Host '[skip] payload normalize onboardingStartedAt already exists'
}

# 2) Existing student update SQL: save students.onboarding_started_at.
if ($text -notmatch 'onboarding_started_at\s*=\s*\?') {
  $pattern = 'student_address\s*=\s*\?,\s*vehicle_info\s*=\s*\?,\s*student_pin\s*=\s*\?,\s*high_subjects\s*=\s*\?'
  $replacement = 'student_address = ?, vehicle_info = ?, onboarding_started_at = ?, student_pin = ?, high_subjects = ?'
  Replace-Regex-Required $pattern $replacement 'UPDATE students onboarding_started_at column'
} else {
  Write-Host '[skip] UPDATE students onboarding_started_at column already exists'
}

# 3) Existing student update bind: bind d.onboardingStartedAt between vehicle and PIN.
if ($text -notmatch 'd\.vehicleInfo,\s*\n\s*d\.onboardingStartedAt,\s*\n\s*d\.studentPin') {
  $oldBind = @'
      d.studentAddress,
      d.vehicleInfo,
      d.studentPin,
'@
  $newBind = @'
      d.studentAddress,
      d.vehicleInfo,
      d.onboardingStartedAt,
      d.studentPin,
'@
  Replace-Exact-Required $oldBind $newBind 'UPDATE bind onboardingStartedAt'
} else {
  Write-Host '[skip] UPDATE bind onboardingStartedAt already exists'
}

# Optional insert support. Do not fail if local insert SQL differs.
if ($text -notmatch 'vehicle_info\s*,\s*onboarding_started_at\s*,\s*student_pin') {
  $newInsertCols = [regex]::Replace($text, 'student_phone\s*,\s*parent_phone\s*,\s*student_address\s*,\s*vehicle_info\s*,\s*student_pin\s*,', 'student_phone, parent_phone, student_address, vehicle_info, onboarding_started_at, student_pin,', 1)
  if ($newInsertCols -ne $text) {
    $text = $newInsertCols
    Write-Host '[patch] INSERT columns onboarding_started_at optional'
    # Try to add one placeholder just before DATETIME sequence in the first INSERT values section.
    $newValues = [regex]::Replace($text, "VALUES\s*\(([^\)]*?)DATETIME\('now'\),\s*DATETIME\('now'\)\)", {
      param($m)
      $prefix = $m.Groups[1].Value
      # Only add if the values prefix appears to have one fewer placeholder than columns after our insertion.
      if ($prefix -notmatch "\?,\s*DATETIME\('now'\)") {
        return $m.Value
      }
      return $m.Value
    }, 1)
    # Bind for insert only if it uses d.vehicleInfo, pin sequence.
    if ($text -notmatch 'd\.vehicleInfo,\s*\n\s*d\.onboardingStartedAt,\s*\n\s*pin') {
      $text2 = $text.Replace(@'
        d.studentAddress,
        d.vehicleInfo,
        pin,
'@, @'
        d.studentAddress,
        d.vehicleInfo,
        d.onboardingStartedAt,
        pin,
'@)
      if ($text2 -ne $text) {
        $text = $text2
        Write-Host '[patch] INSERT bind onboardingStartedAt optional'
      } else {
        Write-Warning 'INSERT bind pattern not found; existing-student update is still patched.'
      }
    }
  } else {
    Write-Warning 'INSERT column pattern not found; skipped new-student insert support. Existing-student update is patched.'
  }
} else {
  Write-Host '[skip] INSERT columns already include onboarding_started_at'
}

# Required verification for the current bug: existing student edit must persist.
if ($text -notmatch 'onboardingStartedAt\s*:') {
  throw 'Verification failed: onboardingStartedAt payload field missing.'
}
if ($text -notmatch 'onboarding_started_at\s*=\s*\?') {
  throw 'Verification failed: UPDATE SQL does not save onboarding_started_at.'
}
if ($text -notmatch 'd\.vehicleInfo,\s*\n\s*d\.onboardingStartedAt,\s*\n\s*d\.studentPin') {
  throw 'Verification failed: UPDATE bind does not include d.onboardingStartedAt before d.studentPin.'
}

if ($text -eq $orig) {
  Write-Host '[result] no changes needed; file already has required update support.'
} else {
  [System.IO.File]::WriteAllText($StudentRoute, $text, $utf8NoBom)
  Write-Host "[write] $StudentRoute"
}

Write-Host "`n[check] node --check routes\\students.js"
node --check $StudentRoute
Write-Host "`n[check] node --check index.js"
node --check $IndexFile

if ($Deploy) {
  Write-Host "`n[deploy] worker"
  Push-Location $WorkerDir
  try {
    npx wrangler@latest deploy --config .\wrangler.jsonc
  } finally {
    Pop-Location
  }
  if ($VerifyStudentId) {
    Write-Host "`n[verify] current DB value for $VerifyStudentId"
    npx wrangler@latest d1 execute ap-math-os --remote --command "SELECT id, name, grade, onboarding_started_at FROM students WHERE id='$VerifyStudentId';"
  }
}

Write-Host "`n[DONE] Existing student edits now save students.onboarding_started_at. Test in browser with Ctrl+F5."

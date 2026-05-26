param(
  [string]$Config = "pipeline.miraen.config.json"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $Root

node tools\textbook-pipeline\run-oneclick-pipeline.mjs --config $Config

$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath (Join-Path $taskRoot 'frontend')
npm ci
npm run dev


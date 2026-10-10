$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot
$env:ConnectionStrings__Store=if($env:ConnectionStrings__Store){$env:ConnectionStrings__Store}else{'Host=localhost;Port=55432;Database=penitent;Username=penitent;Password=penitent-local-only'}
$env:ASPNETCORE_ENVIRONMENT='Development'
$env:ASPNETCORE_URLS='http://localhost:5080'
$env:Seed__Enabled='true'
$taskSecrets=Join-Path $taskRoot 'backend/Penitent.Api/.env.local'
if(!(Test-Path -LiteralPath $taskSecrets)){
 $taskBytes=New-Object byte[] 24
 $taskRng=[System.Security.Cryptography.RandomNumberGenerator]::Create()
 $taskRng.GetBytes($taskBytes)
 $taskRng.Dispose()
 $taskPassword=[Convert]::ToBase64String($taskBytes)+'!aA1'
 @('Admin__Email=admin@example.test',"Admin__Password=$taskPassword")|Set-Content -LiteralPath $taskSecrets
}
Get-Content -LiteralPath $taskSecrets|ForEach-Object{$entry=$_.Split('=',2);[Environment]::SetEnvironmentVariable($entry[0],$entry[1],'Process')}
dotnet run --no-launch-profile --project backend/Penitent.Api


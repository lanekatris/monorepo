$filename = new-temporaryfile
$destination = If ($IsWindows) {"C:\MyPrograms\"} else {"~/bin/"}
$release = If ($IsWindows) {"monorepo_windows_amd64.zip"} else {"monorepo_linux_amd64"}

$ProgressPreference = 'SilentlyContinue' # Speed up the download
Invoke-WebRequest "https://github.com/lanekatris/monorepo/releases/latest/download/$release.zip" -OutFile $filename

Expand-Archive -Path $filename -DestinationPath $destination -Force

Write-Host -ForegroundColor Green "Success!"
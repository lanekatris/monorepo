$filename = "c:\temp\$(get-random).zip"

$ProgressPreference = 'SilentlyContinue' # Speed up the download
Invoke-WebRequest https://github.com/lanekatris/monorepo/releases/latest/download/monorepo_windows_amd64.zip -OutFile $filename

Expand-Archive -Path $filename -DestinationPath ~/OneDrive/Desktop -Force

Write-Host -ForegroundColor Green "Success!"
Write-Host "Don't forget to clear out: c:\temp"
Get-ChildItem c:\temp\*.zip
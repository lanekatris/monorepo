dotnet publish -c Release -r win-x64 --self-contained true
Write-Host "Copying files..."
Copy-Item -Recurse -Force -Destination c:\MyPrograms\arbiter bin\Release\net6.0\win-x64\*
Write-Host "Success man!"
Copy-Item -Recurse -Force -Path C:\Users\looni\vault1\Public\* C:\Code\brain\content

Set-Location C:\Code\brain

git add .
git commit -m "Updated brain from Obsidian"
git push

Set-Location -
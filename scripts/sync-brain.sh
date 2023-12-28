git -C /home/lane/git/brain pull

# https://stackoverflow.com/questions/20300971/rsync-copy-directory-contents-but-not-directory-itself
rsync -a /home/lane/Documents/lkat-vault/Public/ /home/lane/git/brain/content



git add .
git commit -m "Updated brain from Obsidian"
git push

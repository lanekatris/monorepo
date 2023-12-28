#!/bin/sh
git -C /home/lane/git/brain pull

# https://stackoverflow.com/questions/20300971/rsync-copy-directory-contents-but-not-directory-itself
rsync -a /home/lane/Documents/lkat-vault/Public/ /home/lane/git/brain/content



git -C /home/lane/git/brain add .
git -C /home/lane/git/brain commit -m "Updated brain from Obsidian"
git -C /home/lane/git/brain push

#rsync -av --delete ~/Documents/lkat-vault/60-69\ Projects/63\ Poc/65\ Blog/Blog/ ~/monorepo/software/blog/src/content/blog
rsync -av --delete ~/Documents/lkat-vault/60-69\ Projects/63\ Poc/65\ Blog/Blog/ /home/lane/git/my-new-blog/src/content/posts

# nix-shell -p fswatch
# fswatch -o ~/Documents/lkat-vault/60-69\ Projects/63\ Poc/65\ Blog/Blog/ | xargs -n1 rsync -av --delete ~/Documents/lkat-vault/60-69\ Projects/63\ Poc/65\ Blog/Blog/ ~/monorepo/software/blog/src/content/blog

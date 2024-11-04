# Lane's Monorepo

I started with a bunch of repos and now I'm trying to migrate to one.

Some were private because I'm bad about committing api keys... but I'm changing my ways and having things public forces this 

Here is a blog article to how this repo is laid out:
TODO link






## Blog

- `ln -s /home/lane/git/monorepo/content/images /home/lane/git/monorepo/software/blog/public/images`
- `ln -s /home/lane/git/monorepo/content/assets /home/lane/git/monorepo/software/web/content/assets`
- `ln -s /home/lane/git/monorepo/content/blog /home/lane/git/monorepo/software/web/content/posts`

## Loonison.com

```powershell
cd software\js
node_modules/.bin/nx serve web

```

## Feed

```powershell
cd scripts
.\sync-obsidian-s3.ps1
```

Kick off Kestra: http://server1.local:8090/ui/flows/edit/dev/feedGenerateFromObsidianAdventures

Kick off netlify: https://app.netlify.com/sites/mellow-sunburst-a1d9d3/deploys

docker run -e POSTGRES_CONN=XXXXXXXX lk me
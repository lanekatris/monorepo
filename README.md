# Lane's Monorepo

setup windows
- https://www.lazyvim.org/installation
```
winget -i ./winget.json
```

# 2025-07-18

## Blog

Careful, the `.env` file gets copied to the image...

```
sudo docker compose build
sudo docker compose up -d
```

I started with a bunch of repos and now I'm trying to migrate to one.

Some were private because I'm bad about committing api keys... but I'm changing my ways and having things public forces
this

Here is a blog article to how this repo is laid out:
TODO link

## Blog

TODO: make this a script to add or remove sym links

- `ln -s /home/lkat/Documents/monorepo/content/images /home/lkat/Documents/monorepo/software/blog/public/images`
- `ln -s /home/lkat/Documents/monorepo/content/assets /home/lkat/Documents/monorepo/software/blog/src/assets`
- `ln -s /home/lkat/Documents/monorepo/content/blog /home/lkat/Documents/monorepo/software/blog/src/content/posts`

For windows run as admin:

- `mklink /D "C:\Code\monorepo\software\web\content\posts" "C:\Code\monorepo\content\blog"`
- `mklink /D "C:\Code\monorepo\software\web\content\assets" "C:\Code\monorepo\content\assets"`
- `mklink /D "C:\Code\monorepo\software\web\content\images" "C:\Code\monorepo\content\images"`

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

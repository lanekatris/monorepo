---
slug: august-2024-website-updates
date: 2024-10-14
draft: true
title: Website Updates
---

As I've been changing up my website deployment pipeline, I still have the same issue of how to update my container when there is a new version. I'm running via docker compose. Watchtowerr hasn't been working for me

Random
- velite is cool and does extremely similar to astro
- running nextjs as pure dynamic as made things so much easier/faster/and smaller container size
- using Usememos as somewhat of a cms may work, not sure - but no reason to introduce something new since I suck at content creation
- You can filter usememos posts by tag which i'm doing on my home page, goes back to using it kind of like a cms
- I got kestra working, somehow I lost my `.env` file and bad things happened. I've now backed it up in entirety in 1password
- I got auto updating the container every 30 minutes via watchtowerr - I had to run everything as root though in docker... a problem to figure out another day 
  - I had to do this since mounting `docker.sock` to watchtowerr in my `docker-compose` only gave it access to containers running as root
      - A poor mans - yet beautiful way to update the container though: https://gist.github.com/kizzx2/782b500a81ce46b889903b1f80353f21
- Briefly, I thought I should host a private docker repo for speed and polling... nah KISS
  - Also you can persist it to disk: https://distribution.github.io/distribution/storage-drivers/filesystem/
- I had a hard time changing up my github actions with passing environment variables and the native build step of nextjs needed to reach out to a databasetc.
    - I gave up with this nonsense, I made Next.js run always dynamic. This makes the app seemingly faster and build process easier
    - Why still use nextjs since your always dynamic? - I can write React and sql queries on the server... beutiful - I'd like to use golang but I don't want ugly `templ`, I want JSX
- Don't forget you can run github actions on push of a branch: https://stackoverflow.com/questions/58139406/only-run-job-on-specific-branch-with-github-actions

Website particulars
- more of a real blog section
- syntax highlighting
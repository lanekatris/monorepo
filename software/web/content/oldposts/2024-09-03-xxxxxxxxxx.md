---
title: "xxxxxxxx"
description: ''
date: "2024-09-03"
tags: []
draft: true
slug: 2024-09-03-xxxxxxxx
---

# Your content starts here

talk about
* workflow file is easy, as it runs on ubuntu, you don't have to worry about the container - https://github.com/lanekatris/monorepo/blob/main/.github/workflows/web-docker.yml
* I had permission errors to docker.sock, taht nodejs was commentd out, making it run as root... bad bad, how to fix?
  https://forums.docker.com/t/permission-for-v-var-run-docker-sock/132976
* nextjs will give errrors if you don't return a next response - so it doesn't support callbakcs from waht i can tell - so i needed to convert to promise based -
  https://www.google.com/search?q=exec+process+promise+nodejs&oq=exec+process+promise+nodejs&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigATIHCAQQIRigATIHCAUQIRigATIHCAYQIRifBTIHCAcQIRifBTIHCAgQIRifBTIHCAkQIRifBdIBCDQ1MjZqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8
* I forgot how to install things in alpine: `sudo apk add --update-cache docker-cli`

side quest, I love my image is so much smaller:
https://hub.docker.com/repository/docker/loonison101/web/tags
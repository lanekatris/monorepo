---
title: Docker variable not set
pubDate: 2024-11-12
tags: []
---

# Background
I needed to update a connection string in my docker compose; so I did just that.

It just so happened to be a Snowflake connection string.

WHEN TESTING IT KEPT SAYING WRONG USERNAME OR PASSWORD!

Luckily, in console output I saw that I was getting a weird warning:
> The "xxx" variable is not set. Defaulting to blank string

# Fix

This [article](https://forums.docker.com/t/warn-0000-the-he-variable-is-not-set-defaulting-to-a-blank-string/137212) helped lead me down the right path.

Well, it just so happens that `$` is for variable interpolation and my password had a `$`.

So you need to escape it: `$$`

🤷

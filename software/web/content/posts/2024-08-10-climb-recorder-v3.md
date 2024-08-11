---
---

### Why
I want this but I want it to be extremely simple so it has the highest chance of not being deleted or rewritten.

### Simplicity

Random Things
- I switched to `.http` file instead of in my browser making api requests so I can easily test and remember endpoints
- Using SQLite, I decided to use numbers for dates in Epoch time since it doesn't have a date type
- Nano ID for ids just because I don't want to deal with auto incrementing FKs (they aren't a bad thing)
- Had to [use an IIFE](https://github.com/drizzle-team/drizzle-kit-mirror/issues/246) to run Drizzle migrations
- Didn't know [tsx](https://tsx.is/getting-started) existed, very cool
- Decided to use [Drizzle](https://orm.drizzle.team/docs/migrations) as an ORM just because I've never used it before and I hate to concat SQL strings
- I had issues calling `ffprobe`... so I gave up and used [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg) and it works great
- I wanted to debug NextJS and forgot how to in Webstorm, it is soo easy if you [fire it up from the package.json](https://stackoverflow.com/a/65224597/1040387)
- I forgot how to [structure async calls in a map](https://stackoverflow.com/questions/33438158/best-way-to-call-an-asynchronous-function-within-map)
- I can't get `ffmpeg` to [format file names in Epoch time](https://stackoverflow.com/questions/61129758/ffmpeg-strftime-microseconds)
- It's crazy you can't filter files when doing `fs.readdir`, you have to do it in memory after loading all files
- 
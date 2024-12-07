---
title: "Website Update December 2024"
pubDate: "2024-12-07"
tags: [ ]
---

# New Theme

New theme using [terminalcss.xyz](https://terminalcss.xyz/)!

(_Inspired by [zkbro](https://html-chunder.neocities.org/)_)

# Astro Upgrade to v5

Went well, be sure you run `astro sync`. Sometimes you have to export something different in the `content.config.ts` for
Astro to see your changes... Seems buggy but I moved past it.

I made some [sql](https://neon.tech/docs/guides/astro) and json
collection [loaders](https://docs.astro.build/en/guides/content-collections/#the-collection-config-file), and it works
great.

# General

I forgot that `<style>` in an Astro component is scoped only to it, so I needed to
add [global styling](https://docs.astro.build/en/guides/styling/#global-styles) to `global.css`.

On my [disc golf](/disc-golf) page I added an `HTML` only collapsible content using `<details`.

# RSS

I can't get images to work in my RSS feed... I spent a little bit of time on it. So I am now only producing the blog
article name in the feed. This doesn't feel good, but I'll spend more time on it down the road.

# Charts!

On my [disc golf](/disc-golf) page, along with other pages I wanted to show chart(s). I don't want JS needed just
to KISS. [Chart.js](https://www.chartjs.org/docs/latest/charts/line.html) seems like a fine choice and got it working
with [chartjs-node-canvas](https://github.com/SeanSobey/ChartjsNodeCanvas). `chartjs-node-canvas` last update was ~2
years ago which is slightly concerning, but who cares, I can produce png charts server side in Astro 💪

I was going to mess with [svg-radar-chart](https://github.com/derhuerst/svg-radar-chart) because
if [this](https://stackoverflow.com/questions/49530319/how-to-generate-chart-on-serverside-with-nodejs)
and [this](https://css-tricks.com/svg-charting-libraries/) article but
found no need.

I didn't have much luck looking for charting libraries:

- [Reddit](https://www.reddit.com/r/astrojs/comments/1g21hop/looking_for_chart_library_suggestions/)

**Why?**

I was forced to use `chartjs-node-canvas` because in `<style>` tags you can't `import` code and pass variables
via [define:vars](https://docs.astro.build/en/reference/directives-reference/#definevars) or I would have used pure
`Chart.js`.

**Follow Up**

I think [this](https://dteather.com/blogs/astro-interactive-charts/) article that uses Apex charts will be a better
version of what I'm doing.

Research:

- [Link 1](https://docs.astro.build/en/guides/client-side-scripts/#script-processing)
- [Link 2](https://github.com/withastro/astro/issues/6642)
- [Link 3](https://www.reddit.com/r/astrojs/comments/1bioye6/passing_variable_from_script_tag_to_rest_of_the/)
- I didn't spend time on [highcharts](https://www.highcharts.com/), not sure why

# Deploying to Cloudflare

Before I was manually [dragging a folder](https://developers.cloudflare.com/pages/get-started/direct-upload/) onto their
web dashboard UI to deploy. Now I have a `MakeFile` that uses their
[wrangler CLI](https://developers.cloudflare.com/pages/get-started/direct-upload/#wrangler-cli) to deploy. It even does
an intelligent diff instead of uploading everything; which is what the previous
method did.
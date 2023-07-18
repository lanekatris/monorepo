

This guy was helpful:

<iframe width="800" height="500" src="https://www.youtube.com/embed/F_jqADu-izk" title="How to add search functionality to Docusaurus with Algolia Docusearch and a custom crawler" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Run this guy: ` docker run --env-file=.env -e "CONFIG=$(cat /c/Code/monorepo/software/js/packages/lanekatriscom/algolia.json | jq -r tostring)" algolia/docsearch-scraper` from git bash

I forgot that netlify was adding `www` to my domain, so I had to be sure the config file included that

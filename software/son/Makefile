deploy:
	node ./strip-metadata.js
	npm run build
	npx wrangler pages deploy dist --project-name troykatris

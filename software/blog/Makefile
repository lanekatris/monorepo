deploy:
	node ./strip-metadata.js
	npm run build
	npx wrangler pages deploy dist

deploy-server:
	docker build -t server1:5000/blog -f ../../blog.Dockerfile ../..
	docker push server1:5000/blog
	ssh -t lane@100.99.14.109 "cd /home/lane/monorepo && sudo docker compose up -d"

deploy-all: deploy deploy-server
	echo "DONE"
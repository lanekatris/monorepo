TOKEN := $(shell op read op://Personal/homelab/web_preshared_key)

deploy:
	docker build -t loonison101/web .
	docker push loonison101/web
	curl "https://loonison.com/api/hook/github_action_completed?token=$(TOKEN)"
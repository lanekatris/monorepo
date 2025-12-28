

deploy-server:
	export CGO_ENABLED=0; export GOOS=linux;export GOARCH=amd64; go build cmd/lk/main.go
	ssh -t lane@server1 "sudo systemctl stop lk-worker.service"
	scp ./main lane@server1:/home/lane/lk
	ssh -t lane@server1 "sudo systemctl start lk-worker.service"

deploy-local:
	go build cmd/lk/main.go
	# sudo systemctl stop lk.service
	cp ./main ~/bin/lk
	# sudo systemctl start lk.service
	# journalctl -u lk.service -f

deploy-service: deploy-local
	sudo cp ./lk.service /etc/systemd/system/
	@read -p "Update the environment variables if needed... " dummy
	sudo systemctl daemon-reexec
	sudo systemctl daemon-reload
	sudo systemctl enable lk.service

deploy-docker:
	docker build -t loonison101/lk:main .
	docker push loonison101/lk:main
	ssh -t lane@100.97.2.90 '\
		cd /home/lane/monorepo/infrastructure/homelab && \
		 docker compose pull lkat && \
		 docker compose up -d lkat \
	'

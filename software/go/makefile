

deploy-server:
	export CGO_ENABLED=0; export GOOS=linux;export GOARCH=amd64; go build cmd/lk/main.go
	ssh -t lane@100.99.14.109 "sudo systemctl stop lk.service"
	scp ./main lane@100.99.14.109:/home/lane/lk
	ssh -t lane@100.99.14.109 "sudo systemctl start lk.service"

deploy-local:
	go build cmd/lk/main.go
	sudo systemctl stop lk.service
	cp ./main ~/bin/lk
	sudo systemctl start lk.service
	journalctl -u lk.service -f

deploy-service: deploy-local
	sudo cp ./lk.service /etc/systemd/system/
	@read -p "Update the environment variables if needed... " dummy
	sudo systemctl daemon-reexec
	sudo systemctl daemon-reload
	sudo systemctl enable lk.service


deploy-server:
	export CGO_ENABLED=0; export GOOS=linux;export GOARCH=amd64; go build cmd/lk/main.go
	ssh -t lane@100.99.14.109 "sudo systemctl stop lk.service"
	scp ./main lane@100.99.14.109:/home/lane/lk
	ssh -t lane@100.99.14.109 "sudo systemctl start lk.service"

deploy-local:
	go build cmd/lk/main.go
	cp ./main ~/bin/lk

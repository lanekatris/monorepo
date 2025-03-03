

deploy-server:
	export CGO_ENABLED=0; export GOOS=linux;export GOARCH=amd64; go build cmd/lk/main.go
	ssh -t lane@server1 "sudo systemctl stop lk.service"
	scp ./main lane@server1.local:/home/lane/lk
	ssh -t lane@server1.local "sudo systemctl start lk.service"

deploy-local:
	go build cmd/lk/main.go
	cp ./main ~/bin/lk

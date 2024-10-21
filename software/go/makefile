

deploy-server:
	export CGO_ENABLED=0; go build cmd/lk/main.go
	scp ./main server1.local:/home/lane/lk
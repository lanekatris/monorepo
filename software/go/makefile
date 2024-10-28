

deploy-server:
	export CGO_ENABLED=0; go build cmd/lk/main.go
	# TODO: Figure out how to do sudo
	#ssh -S lane@server1.local "sudo systemctl stop lk.service"
	scp ./main server1.local:/home/lane/lk
	#ssh -S lane@server1.local "sudo systemctl start lk.service"

deploy-local:
	go build cmd/lk/main.go
	cp ./main ~/bin/lk

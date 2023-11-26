proto:
	protoc proto/* --go_out=./ --go-grpc_out=./

lkat:
	go build -o bin/lkat ./cmd/lkat/main.go

lk:
	go build -o bin/lk ./cmd/lk/main.go

generate: clean proto lkat lk

clean:
	rm -f ./lk
	rm -f ./main
	rm -f ./lkat
	rm -rf bin/*.*

deploy: generate
	cp ./bin/* /home/lane/MyPrograms/computer-api

docker-lk:
	docker build -t lk .
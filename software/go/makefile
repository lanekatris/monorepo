generate-proto:
	protoc all.proto --go_out=./ --go-grpc_out=./

generate-lkat:
	go build -o lkat ./cmd/lkat/main.go

generate-lk:
	go build -o lk ./cmd/lk/main.go

generate: clean generate-proto generate-lkat generate-lk

clean:
	rm -f ./lk
	rm -f ./main
	rm -f ./lkat
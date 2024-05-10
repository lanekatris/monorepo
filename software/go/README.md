Add a new command with cobra

```
go install github.com/spf13/cobra-cli@latest
cd cmd/lk
cobra-cli add fitness
```



go build ./worker/main.go && mv ./main ~/Desktop/lkat-worker




deploy lk

```
go build ./cmd/lk/main.go && mv ./main ~/MyPrograms/computer-api/lk
```

run from docker:
docker run -v C:\users\looni\.lk.yaml:/config/.lk.yaml -it --entrypoint bash lk

docker run -v C:\users\looni\.lk.yaml:/config/.lk.yaml lk worker
package main

import (
	"log"
	"net"
	"net/http"
	"os"
)

func main() {
	socketPath := "/tmp/example.sock"

	// Clean up any existing socket
	_ = os.Remove(socketPath)

	ln, err := net.Listen("unix", socketPath)
	if err != nil {
		log.Fatal(err)
	}
	defer ln.Close()

	// Optional: restrict who can access it
	if err := os.Chmod(socketPath, 0600); err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello from unix socket\n"))
	})

	log.Println("listening on unix socket:", socketPath)
	log.Fatal(http.Serve(ln, mux))
}

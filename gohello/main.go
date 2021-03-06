package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func main() {
	logger := log.New(os.Stderr, "gohello: ", log.Llongfile|log.Lmicroseconds|log.LstdFlags)
	logger.Println("starting...")

	var (
		traceAgent = env("JAEGER_AGENT_ADDR").WithDefault("127.0.0.1:6831")
		addr       = env("HELLO_ADDR").WithDefault(":8080")
		services   = strings.Split(env("SERVICES").WithDefault(""), ",")
	)

	if err := traces(traceAgent, "gohello"); err != nil {
		logger.Fatal(err)
	}
	logger.Println("tracing on.")

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ctx, sp := startReqSpan(r, "gohello-gateway")
		defer sp.Finish()
		logger.Println("/ hit")

		var rr []string
		for _, s := range services {
			if s == "" {
				continue
			}
			r, err := ping(ctx, s)
			if err != nil {
				logger.Printf("ERROR hitting service (%q): %v", s, err)
			}
			rr = append(rr, r)
		}

		fmt.Fprintf(w, "go hello, got messages for other services: %v", rr)
	})
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		_, sp := startReqSpan(r, "gohello-hello")
		defer sp.Finish()
		logger.Println("/hello hit")
		fmt.Fprintln(w, "Hello Go!")
	})

	logger.Println("serving on", addr)
	logger.Fatal(http.ListenAndServe(addr, mux))
}

func ping(ctx context.Context, url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req = withTrace(ctx, req)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode >= 400 {
		return "", fmt.Errorf("bad status: %d", res.StatusCode)
	}
	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

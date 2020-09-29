package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"time"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func writeToMongo() string {

	cmd := exec.Command("mongoimport", "--collection=posts", "--file=data.json", "--jsonArray")
	err := cmd.Run()
	check(err)

	if cmd.ProcessState.Success() {
		return "New collection posts was created in the test Database"
	}

	return "Something Went Wrong :("
}
func main() {
	client := &http.Client{Timeout: 10 * time.Second}
	// GET http request to https://jsonplaceholder.typicode.com/posts
	resp, err := client.Get("https://jsonplaceholder.typicode.com/posts")
	check(err)
	defer resp.Body.Close()
	// create data.json file
	out, err := os.Create("data.json")
	check(err)
	defer out.Close()
	// pipe http response to new file
	io.Copy(out, resp.Body)
	// import json file to mongo (db=test collection=posts)
	msg := writeToMongo()
	fmt.Println(msg)

	check(os.Remove("data.json"))
}

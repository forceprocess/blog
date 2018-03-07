package main

import (
	"net/http"
	_ "router"
	. "utils"
)

func main() {

	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		Error.Fatal("启动服务报错:", err)
	}
}

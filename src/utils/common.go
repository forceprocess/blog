package utils

import (
	"os"
	"strings"
)

var (
	CtxPath string
)

func init() {
	dir, err := os.Getwd()
	dir = dir + string(os.PathSeparator)
	if err != nil {
		Error.Fatal("获取项目路径报错")
		return
	}
	if strings.Index(dir, "src") > -1 {
		CtxPath = dir[0:strings.Index(dir, "src")]
	}
}

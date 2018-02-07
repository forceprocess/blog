package router

import (
	"net/http"
	. "utils"
	"api"
)

func init() {

	FileInfo.Println("路由开始初始化")

	//静态资源服务
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(CtxPath+"static"))))

	//首页
	http.Handle("/", http.FileServer(http.Dir(CtxPath+"view")))

	// QQ号测试
	http.HandleFunc("/doQQNoTest", api.DoQQNo)

	FileInfo.Println("路由初始化完成")
}

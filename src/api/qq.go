package api

import (
	"net/http"
	. "utils"
	"io/ioutil"
	"encoding/json"
)

type Content struct {
	QqNo string `json:"qq"`
	ErrorCode int `json:"error_code"`
	Reason string `json:"reason"`
	Result Data	`json:"result"`
}

type Data struct {
	ContentObj Obj `json:"data"`
} 

type Obj struct {
	Conclusion string `json:"conclusion"`
	Analysis string `json:"analysis"`
}

func DoQQNo(w http.ResponseWriter, r *http.Request) {

	err := r.ParseForm()
	if err != nil {
		FileError.Println(err)
		return
	}

	url :="http://japi.juhe.cn/qqevaluate/qq?qq=" + r.PostFormValue("qqNo") + "&key=340f0e64f57ee81109ae7f2581464e04"
	resp, err := http.Get(url)
	if err != nil {
		FileError.Println(err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		FileError.Println(err)
		return
	}

	var content Content
	json.Unmarshal(body, &content)
	content.QqNo = r.PostFormValue("qqNo")
	buf,_:=json.Marshal(content)
	FileInfo.Println(string(buf))

	w.Write(body)
}

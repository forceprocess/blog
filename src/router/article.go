package router

import (
	"net/http"
	. "utils"
	"encoding/json"
	"strconv"
	"net"
)

type Article struct {
	Id         int    `json:"id"`
	Title      string `json:"title"`
	Author     string `json:"author"`
	Content    string `json:"content"`
	CreateTime string `json:"createTime"`
	Ip         string `json:"ip"`
}

// DoAddArticle 添加
func DoAddArticle(w http.ResponseWriter, r *http.Request) {

	result := Result{}

	err := r.ParseForm()
	if err != nil {
		FileError.Println(err)
		return
	}

	if r.Method != "POST" {
		FileError.Println("只支持post请求")
		return
	}

	title := r.PostFormValue("title")
	author := r.PostFormValue("author")
	content := r.PostFormValue("content")
	ip, _, _ := net.SplitHostPort(r.RemoteAddr)

	forward := r.Header.Get("X-Forwarded-For")
	if forward != "" {
		ip = forward
	}

	sql := "insert into blog(title,author,content,ip,create_time) values(?,?,?,?,NOW())"
	stmt, err := DB.Prepare(sql)
	if err != nil {
		FileError.Println(err)
		return
	}
	defer stmt.Close()

	res, err := stmt.Exec(title, author, content, ip)
	if err != nil {
		FileError.Println(err)
		return
	}

	id, _ := res.LastInsertId()

	FileInfo.Printf("新增id=%v    ip=%v \r\n", id, ip)
	result.Success = true
	result.Message = "添加成功"
	buf, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json")
	w.Write(buf)
}

// DoAddArticle 添加
func DoArticlePageList(w http.ResponseWriter, r *http.Request) {

	result := Result{}

	err := r.ParseForm()
	if err != nil {
		FileError.Println(err)
		return
	}

	if r.Method != "POST" {
		FileError.Println("只支持post请求")
		return
	}

	num, _ := strconv.Atoi(r.PostFormValue("num"))
	size, _ := strconv.Atoi(r.PostFormValue("size"))

	if more, _ := strconv.ParseBool(r.PostFormValue("more")); more {
		start := (num - 1) * size
		sql := "select id, title, author, content, create_time, ip from blog order by create_time desc limit ?,?"
		rows, err := DB.Query(sql, start, size)
		if err != nil {
			FileError.Println(err)
			return
		}
		defer rows.Close()

		articleList := make([]Article, 0)
		for rows.Next() {
			var article Article
			rows.Scan(&article.Id, &article.Title, &article.Author, &article.Content, &article.CreateTime, &article.Ip)
			articleList = append(articleList, article)
		}

		result.Data = articleList
		result.Success = true
		result.Message = "查询成功"
	}
	buf, _ := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json")
	w.Write(buf)
}

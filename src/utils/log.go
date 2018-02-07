package utils

import (
	"log"
	"os"
	"io"
)

var (
	Info      *log.Logger
	FileInfo  *log.Logger
	Warning   *log.Logger
	Error     *log.Logger
	FileError *log.Logger
)

func init() {

	logFile, err := os.OpenFile(logFilePath(), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalln("打开日志文件失败：", err)
		return
	}
	Info = log.New(os.Stdout, "Info:", log.LstdFlags|log.Lshortfile)
	FileInfo = log.New(io.MultiWriter(os.Stderr, logFile), "Info:", log.LstdFlags|log.Lshortfile)
	Warning = log.New(os.Stdout, "Warning:", log.LstdFlags|log.Lshortfile)
	Error = log.New(os.Stdout, "Error:", log.LstdFlags|log.Lshortfile)
	FileError = log.New(io.MultiWriter(os.Stderr, logFile), "Error:", log.LstdFlags|log.Lshortfile)
}

//logFilePath 日志文件路径
func logFilePath() string {
	return CtxPath + "logs/blog.log"
}

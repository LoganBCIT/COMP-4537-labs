const fs = require("fs");
const path = require("path");
const en = require("../lang/en.js");

class FileApi {
  static getFilePath() {
    return path.join(en.tmpDir || "/tmp", en.fileName || "file.txt");
  }
  static sendHtml(res, status, body) {
    res.statusCode = status;
    res.setHeader(en.hContentType || "Content-Type", en.hHtmlUtf8 || "text/html; charset=utf-8");
    res.end("<pre>" + body + "</pre>");
  }
  static write(req, res) {
    const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const params = new URLSearchParams(q);
    const text = (params.get("text") || "").trim();
    if (text.length === 0) {
      FileApi.sendHtml(res, 400, en.msgMissingText || "Missing ?text= query");
      return;
    }
    fs.appendFile(FileApi.getFilePath(), text + "\n", (err) => {
      if (err) {
        FileApi.sendHtml(res, 500, "Error writing file: " + err.message);
        return;
      }
      FileApi.sendHtml(res, 200, (en.msgAppendOkPrefix || "Appended to") + " " + (en.fileName || "file.txt"));
    });
  }
  static read(_req, res) {
    fs.readFile(FileApi.getFilePath(), "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          FileApi.sendHtml(res, 404, (en.msgReadNotFoundPrefix || "File not found:") + " " + (en.fileName || "file.txt"));
          return;
        }
        FileApi.sendHtml(res, 500, "Error reading file: " + err.message);
        return;
      }
      FileApi.sendHtml(res, 200, data);
    });
  }
  static handler(req, res) {
    if (req.method !== "GET") {
      FileApi.sendHtml(res, 405, en.methodNotAllowed || "Method Not Allowed");
      return;
    }
    // Decide operation by path
    if (req.url.startsWith("/api/file/writeFile")) { FileApi.write(req, res); return; }
    if (req.url.startsWith("/api/file/readFile"))  { FileApi.read(req, res);  return; }
    FileApi.sendHtml(res, 404, en.notFound || "Not Found");
  }
}
module.exports = (req, res) => FileApi.handler(req, res);

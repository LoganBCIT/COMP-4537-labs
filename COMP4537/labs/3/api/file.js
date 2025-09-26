const fs = require("fs");
const path = require("path");
const en = require("../lang/en.js");

class FileApi {
  static getFilePath() {
    // Write to /tmp to avoid EROFS on Vercel
    return path.join(en.tmpDir, en.fileName);
  }

  static sendHtml(res, status, body) {
    res.statusCode = status;
    res.setHeader(en.hContentType || "Content-Type", en.hHtmlUtf8 || en.contentTypeHtml);
    // simple <pre> so it shows in browser, not a download
    res.end("<pre>" + body + "</pre>");
  }

  static handleWrite(req, res) {
    // ?text=...
    const qIdx = req.url.indexOf("?");
    const search = qIdx >= 0 ? req.url.slice(qIdx) : "";
    const params = new URLSearchParams(search);
    const text = (params.get("text") || "").trim();

    if (text.length === 0) {
      FileApi.sendHtml(res, 400, en.msgMissingText);
      return;
    }

    const filePath = FileApi.getFilePath();
    fs.appendFile(filePath, text + "\n", (err) => {
      if (err) {
        FileApi.sendHtml(res, 500, "Error writing file: " + err.message);
        return;
      }
      FileApi.sendHtml(res, 200, `${en.msgAppendOkPrefix} ${en.fileName}`);
    });
  }

  static handleRead(req, res) {
    const filePath = FileApi.getFilePath();
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          FileApi.sendHtml(res, 404, `${en.msgReadNotFoundPrefix} ${en.fileName}`);
          return;
        }
        FileApi.sendHtml(res, 500, "Error reading file: " + err.message);
        return;
      }
      FileApi.sendHtml(res, 200, data);
    });
  }

  static handler(req, res) {
    // We only care about GETs for this lab
    if (req.method !== "GET") {
      FileApi.sendHtml(res, 405, "Method Not Allowed");
      return;
    }

    // Vercel invokes this as /api/file/(rest)
    // Your rewrites will map the class URLs to these
    if (req.url.startsWith("/api/file/writeFile")) {
      FileApi.handleWrite(req, res);
      return;
    }
    if (req.url.startsWith("/api/file/readFile")) {
      FileApi.handleRead(req, res);
      return;
    }

    FileApi.sendHtml(res, 404, "Not Found");
  }
}

module.exports = (req, res) => FileApi.handler(req, res);


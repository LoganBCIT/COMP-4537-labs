// api/readFile.js
const fs = require("fs");
const path = require("path");
const en = require("../lang/en.js");

class ReadFile {
  static getFilePath() {
    return path.join(en.tmpDir, en.fileName);
  }

  static sendHtml(res, status, body) {
    res.statusCode = status;
    res.setHeader(en.hContentType, en.hHtmlUtf8);
    res.end("<pre>" + body + "</pre>");
  }

  static handler(req, res) {
    if (req.method !== "GET") {
      ReadFile.sendHtml(res, 405, en.methodNotAllowed);
      return;
    }

    fs.readFile(ReadFile.getFilePath(), "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          ReadFile.sendHtml(res, 404, en.msgReadNotFoundPrefix + " " + en.fileName);
          return;
        }
        ReadFile.sendHtml(res, 500, "Error reading file: " + err.message);
        return;
      }
      ReadFile.sendHtml(res, 200, data);
    });
  }
}

module.exports = (req, res) => {
  ReadFile.handler(req, res);
};

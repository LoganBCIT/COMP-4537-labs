// api/writeFile.js
const fs = require("fs");
const path = require("path");
const en = require("../lang/en.js");

class WriteFile {
  static getFilePath() {
    return path.join(en.tmpDir, en.fileName); // /tmp/file.txt on Vercel
  }

  static sendHtml(res, status, body) {
    res.statusCode = status;
    res.setHeader(en.hContentType, en.hHtmlUtf8);
    res.end("<pre>" + body + "</pre>");
  }

  static handler(req, res) {
    if (req.method !== "GET") {
      WriteFile.sendHtml(res, 405, en.methodNotAllowed);
      return;
    }

    const qIdx = req.url.indexOf("?");
    const params = new URLSearchParams(qIdx >= 0 ? req.url.slice(qIdx) : "");
    const text = (params.get("text") || "").trim();

    if (text.length === 0) {
      WriteFile.sendHtml(res, 400, en.msgMissingText);
      return;
    }

    fs.appendFile(WriteFile.getFilePath(), text + "\n", (err) => {
      if (err) {
        WriteFile.sendHtml(res, 500, "Error writing file: " + err.message);
        return;
      }
      WriteFile.sendHtml(res, 200, en.msgAppendOkPrefix + " " + en.fileName);
    });
  }
}

module.exports = (req, res) => {
  WriteFile.handler(req, res);
};

const fs = require("fs");
const path = require("path");
const en = require("../../lang/en.js");

// constants instead of string literals (no magic numbers)
const STATUS = { OK: 200, BAD: 400, NOT_FOUND: 404, METHOD: 405 };
const Q_TEXT = "text";
const PRE_OPEN = "<pre>";
const PRE_CLOSE = "</pre>";
const HDR_CT = en.hContentType;
const CT_HTML = en.contentTypeHtml;

class FileApi {
  static getFilePath() {
    return path.join(process.cwd(), en.fileName || "file.txt");
  }

  static sendHtml(res, status, body) {
    res.statusCode = status;
    res.setHeader(HDR_CT, CT_HTML);
    res.end(PRE_OPEN + body + PRE_CLOSE);
  }

  // GET /api/file/writeFile?text=...
  static write(req, res) {
    const idx = req.url.indexOf("?");
    const q = idx === -1 ? "" : req.url.slice(idx);
    const params = new URLSearchParams(q);
    const text = (params.get(Q_TEXT) || "").trim();

    if (text.length === 0) {
      FileApi.sendHtml(res, STATUS.BAD, en.msgMissingText);
      return;
    }

    const filePath = FileApi.getFilePath();
    fs.appendFile(filePath, text + "\n", (err) => {
      if (err) {
        FileApi.sendHtml(res, STATUS.BAD, err.message);
        return;
      }
      FileApi.sendHtml(
        res,
        STATUS.OK,
        en.msgAppendOkPrefix + " " + filePath
      );
    });
  }

  // GET /api/file/readFile
  static read(_req, res) {
    const filePath = FileApi.getFilePath();
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          FileApi.sendHtml(res, STATUS.NOT_FOUND, en.msgReadNotFoundPrefix + " " + filePath);
          return;
        }
        FileApi.sendHtml(res, STATUS.BAD, err.message);
        return;
      }
      FileApi.sendHtml(res, STATUS.OK, data);
    });
  }
}

module.exports = { FileApi, STATUS };

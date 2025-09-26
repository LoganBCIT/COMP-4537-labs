// api/file/readFile.js
const { FileApi, STATUS } = require("../lib/fileApi.js");

class ReadEndpoint {
  static handle(req, res) {
    if (req.method !== "GET") {
      FileApi.sendHtml(res, STATUS.METHOD, "Method Not Allowed");
      return;
    }
    FileApi.read(req, res);
  }
}

module.exports = (req, res) => ReadEndpoint.handle(req, res);

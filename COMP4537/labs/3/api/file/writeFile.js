// api/file/writeFile.js
const { FileApi, STATUS } = require("../lib/fileApi.js");

class WriteEndpoint {
  static handle(req, res) {
    if (req.method !== "GET") {
      FileApi.sendHtml(res, STATUS.METHOD, "Method Not Allowed");
      return;
    }
    FileApi.write(req, res);
  }
}

module.exports = (req, res) => WriteEndpoint.handle(req, res);

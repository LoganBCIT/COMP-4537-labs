const { FileApi, STATUS } = require("../lib/fileApi.js");

class Router {
  static PATH_WRITE_SUFFIX = "/writeFile";
  static PATH_READ_SUFFIX  = "/readFile";

  static handle(req, res) {
    if (req.method !== "GET") {
      FileApi.sendHtml(res, STATUS.METHOD, "Method Not Allowed");
      return;
    }

    // route by the path (query removed)
    const pathOnly = req.url.split("?")[0];

    if (pathOnly.endsWith(Router.PATH_WRITE_SUFFIX)) {
      FileApi.write(req, res);
      return;
    }

    if (pathOnly.endsWith(Router.PATH_READ_SUFFIX)) {
      FileApi.read(req, res);
      return;
    }

    FileApi.sendHtml(res, STATUS.NOT_FOUND, "Not Found");
  }
}

module.exports = (req, res) => Router.handle(req, res);

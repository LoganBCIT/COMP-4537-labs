// api/server.js
const en = require("../lang/en.js");
const { Utils } = require("../modules/utils.js");

class Server {
  static handle(req, res) {
    const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const params = new URLSearchParams(q);
    const name = params.get(en.qName) || "";

    res.setHeader(en.hContentType, en.hHtmlUtf8);

    if (req.method === "GET" && name.trim().length > 0) {
      const msg = Utils.fill(en.msg, name.trim()) + Utils.nowString();
      res.statusCode = Utils.STATUS_OK;
      res.end(Utils.page(en.htmlStart, en.blueOpen, msg, en.blueClose, en.htmlEnd));
      return;
    }

    res.statusCode = name ? 404 : Utils.STATUS_BAD;
    const body = name ? en.notFound : en.errMissing;
    res.end(Utils.page(en.htmlStart, en.blueOpen, body, en.blueClose, en.htmlEnd));
  }
}

module.exports = (req, res) => Server.handle(req, res);

class Utils {
  static STATUS_OK = 200;
  static STATUS_BAD = 400;

  static nowString() {
    return new Date().toString();
  }

  static getQueryValue(reqUrl, key) {
    const idx = reqUrl.indexOf("?");
    if (idx === -1) return "";
    const params = new URLSearchParams(reqUrl.slice(idx));
    return params.get(key) || "";
  }

  static fill(template, name) {
    return template.split("{name}").join(name);
  }

  static page(open, pOpen, content, pClose, close) {
    return open + pOpen + content + pClose + close;
  }
}
module.exports = { Utils };

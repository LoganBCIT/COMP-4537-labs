// api/file.js
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "file.txt");

function sendHtml(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("<pre>" + body + "</pre>");
}

module.exports = (req, res) => {
  const url = req.url;

  // --- C.1 Write ---
  if (url.startsWith("/api/file/writeFile")) {
    const idx = url.indexOf("?");
    const params = new URLSearchParams(idx >= 0 ? url.slice(idx) : "");
    const text = (params.get("text") || "").trim();

    if (text.length === 0) {
      sendHtml(res, 400, "Missing ?text= query");
      return;
    }

    fs.appendFile(FILE_PATH, text + "\n", (err) => {
      if (err) {
        sendHtml(res, 500, "Error writing file: " + err.message);
        return;
      }
      sendHtml(res, 200, `Appended "${text}" to file.txt`);
    });
    return;
  }

  // --- C.2 Read ---
  if (url.startsWith("/api/file/readFile")) {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          sendHtml(res, 404, "File not found: file.txt");
        } else {
          sendHtml(res, 500, "Error reading file: " + err.message);
        }
        return;
      }
      sendHtml(res, 200, data);
    });
    return;
  }

  // --- Unknown route ---
  sendHtml(res, 404, "Not Found");
};

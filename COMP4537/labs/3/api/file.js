// api/file.js
const fs = require("fs");
const path = require("path");

const FILE_NAME = "file.txt";
// Use project root so it persists for the life of a single deployment container
const FILE_PATH = path.join(process.cwd(), FILE_NAME);

function sendHtml(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("<pre>" + body + "</pre>");
}

module.exports = async (req, res) => {
  const url = req.url || "";
  const qIndex = url.indexOf("?");
  const search = qIndex >= 0 ? url.slice(qIndex) : "";
  const params = new URLSearchParams(search);

  // C.1: /COMP4537/labs/3/writeFile?text=BCIT
  if (url.includes("/writeFile")) {
    const raw = params.get("text") || "";
    const text = raw.trim();
    if (text.length === 0) {
      sendHtml(res, 400, "Missing ?text= query");
      return;
    }
    // Append (create if missing)
    fs.appendFile(FILE_PATH, text + "\n", (err) => {
      if (err) {
        sendHtml(res, 500, "Error writing file: " + err.message);
        return;
      }
      sendHtml(res, 200, `Appended "${text}" to ${FILE_NAME}`);
    });
    return;
  }

  // C.2: /COMP4537/labs/3/readFile/file.txt
  if (url.includes("/readFile")) {
    // try to capture the file name from the URL (after /readFile/)
    const match = url.match(/\/readFile\/([^?/#]+)/);
    const requested = match && match[1] ? match[1] : FILE_NAME;

    // For the assignment we always read FILE_NAME,
    // but we include what the user asked for in the 404 message.
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          sendHtml(res, 404, `File not found: ${requested}`);
        } else {
          sendHtml(res, 500, "Error reading file: " + err.message);
        }
        return;
      }
      sendHtml(res, 200, data);
    });
    return;
  }

  // Unknown route
  sendHtml(res, 404, "Not Found");
};

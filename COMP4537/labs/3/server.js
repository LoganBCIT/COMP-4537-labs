const { getDate } = require("./modules/utils");
const { MESSAGE, FILE_DNE, INTERNAL_ERROR } = require("./lang/en/en");
const fs = require("fs");
const http = require("http");

// route related constants
const DATE_ROUTE = "getDate";
const WRITE_FILE_ROUTE = "writeFile";
const READ_FILE_ROUTE = "readFile";
const NAME_PARAM = "?name";
const TEXT_PARAM = "?text";
const ROUTE_SIZE = 3;

const FILE_NAME = "file.txt";

class Server {
  // singleton; only one server instance should exist
  static instance = null;

  constructor() {
    if (Server.instance !== null) {
      return Server.instance;
    }
    this.initRoute();
    Server.instance = this;
  }

  // setup the server routes and initialize handlers
  initRoute() {
    http
      .createServer(function (req, res) {
        // get request url
        const fullPath = req.url.split("/");
        if (fullPath.length !== ROUTE_SIZE) {
          return;
        }

        // get main route
        const route = fullPath[1];

        // add handlers
        if (route === DATE_ROUTE) {
          Server.handleGetDate(fullPath, res);
        } else if (route === WRITE_FILE_ROUTE) {
          Server.handleWriteFile(fullPath, res);
        } else if (route === READ_FILE_ROUTE) {
          Server.handleReadFile(fullPath, res);
        } else {
          return;
        }
      })
      .listen(8080);
      console.log("🚀 Server is running at http://127.0.0.1:8080");
  }

  static handleGetDate(fullPath, res) {
    // get name from query param
    const queryParam = fullPath[ROUTE_SIZE - 1].split("=");
    if (queryParam.length !== 2 || queryParam[0] !== NAME_PARAM) {
      return;
    }
    const date = getDate();
    const name = queryParam[1];

    // format message
    const msg = MESSAGE.replace("%1", name).replace("%2", date);
    res
      .writeHead(200, { "Content-Type": "text/html" })
      .end(`<p style="color:blue;">${msg}</p>`);
  }

  static handleWriteFile(fullPath, res) {
    // get text to write from query param
    const queryParam = fullPath[ROUTE_SIZE - 1].split("=");
    if (queryParam.length !== ROUTE_SIZE - 1 || queryParam[0] !== TEXT_PARAM) {
      return;
    }
    const text = queryParam[1];

    // Source: GPT
    fs.appendFile(FILE_NAME, `${text}\n`, (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" }).end(INTERNAL_ERROR);
        return;
      }
      // empty message if written
      res.writeHead(204).end(); // Source: GPT
    });
  }

  static handleReadFile(fullPath, res) {
    // check that file name isn't empty
    if (fullPath[ROUTE_SIZE - 1] === "") {
      return;
    }

    const fileName = fullPath[ROUTE_SIZE - 1];

    // read contents from file, write to client
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        const msg = FILE_DNE.replace("%1", fileName);
        res
          .writeHead(404, { "Content-Type": "text/html" })
          .end(`<p">${msg}</p>`);
        return;
      }
      res
        .writeHead(200, { "Content-Type": "text/html" })
        .end(`<p">${data}</p>`);
    });
  }
}

const server = new Server();


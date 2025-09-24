// server.js — tiny tweak for PaaS
const http = require("http");
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

http.createServer((req, res) => {
  console.log("The server received a request:");
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.end("Hello Attackers\n");
}).listen(PORT, HOST, () => {
  console.log(`Server is listening on ${HOST}:${PORT}`);
});

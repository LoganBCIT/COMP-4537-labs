export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send("Hello Attackers\n");
}

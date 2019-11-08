const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;
//E:\app\PradipKandel\product\11.2.0\dbhome_1\bin
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

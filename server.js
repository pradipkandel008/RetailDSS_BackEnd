const app = require("./app");

const port = process.env.PORT || 8000;
console.log("Server running at port: " + port);
app.listen(port);

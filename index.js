const http = require("http");
const { hello, home, greetings } = require("./helloWorld");
const users = require("./users");
const moment = require("moment");

const server = http.createServer((req, res) => {
  // res.write(hello)
  // res.write(greetings())
  const url = req.url;
  if (url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write(home);
  } else if (url === "/about") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        status: "success",
        message: "respone success",
        description: "Exercise #02",
        date: moment().format("MMMM Do YYYY, h:mm:ss a"),
      })
    );
  } else if (url === "/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        users: users,
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        status: "not found",
        message: "Route tidak ditemukan",
        date: moment().format("MMMM Do YYYY, h:mm:ss a"),
      })
    );
  }
  res.end();
});

const hostname = "127.0.0.1";
const port = 3000;
server.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}`)
);

const fs = require("fs");
const http = require("http");

const port = 8080;
const types = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css"
}

http.createServer((req, res) => {
  if (req.method === "GET") {
    function response(url, type = types[/\.(\w+)$/.exec(url)?.[1]] ?? "text/plain") {
      fs.readFile(url, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": type });
          res.end(data);
        }
      });
    }

    switch (req.url) {
      case "/":
        response("./index.html");
        break;
      case "/home":
        response("./home.html");
        break;
      case "/login":
        response("./login.html");
        break;
      case "/signup":
        response("./signup.html");
        break;
      case "/nc":
        response("./nc.html");
        break;
      default:
        response(`./public${req.url}`);
    }
  } else if (req.method === "POST") {
    let body = "";
    switch (req.url) {
      case "/post/login":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const post = JSON.parse(body);
              const logins = JSON.parse(data);
              if (post.login in logins && post.password === logins[post.login].password) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("200 OK");
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
            }
          });
        });
        break;
      case "/post/signup":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const post = JSON.parse(body);
              const logins = JSON.parse(data);
              if (post.login in logins) {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              } else {
                logins[post.login] = { password: post.password };
                fs.writeFile("./logins.json", JSON.stringify(logins), err => {
                  if (err) {
                    res.writeHead(415, { "Content-Type": "text/plain" });
                    res.end("415 Internal Server Error");
                  } else {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("200 OK");
                  }
                });
              }
            }
          });
        });
        break;
      case "/post/new":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const logins = JSON.parse(data);
              const post = JSON.parse(body);
              if (post.login in logins && post.password === logins[post.login].password) {
                fs.readFile("./chat.json", (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                  } else {
                    const chats = JSON.parse(data);
                    if (!(post.chat in chats)) {
                      chats[post.chat] = { name: post.name, messages: [] };
                      fs.writeFile("./chat.json", JSON.stringify(chats), err => {
                        if (err) {
                          res.writeHead(415, { "Content-Type": "text/plain" });
                          res.end("415 Internal Server Error");
                        } else {
                          res.writeHead(200, { "Content-Type": "text/plain" });
                          res.end("200 OK");
                        }
                      })
                    } else {
                      res.writeHead(200, { "Content-Type": "text/plain" });
                      res.end("200 OK");
                    }
                  }
                });
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
            }
          });
        });
        break;
      case "/post/chats":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const logins = JSON.parse(data);
              const post = JSON.parse(body);
              if (post.login in logins && post.password === logins[post.login].password) {
                fs.readFile("./chat.json", (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                  } else {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(JSON.stringify(Object.keys(JSON.parse(data)).filter(element => element.split(/,/).some(element => element === post.login))));
                  }
                });
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
            }
          });
        });
        break;
      case "/post/chat":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const logins = JSON.parse(data);
              const post = JSON.parse(body);
              if (post.login in logins && post.password === logins[post.login].password) {
                fs.readFile("./chat.json", (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                  } else {
                    const chat = JSON.parse(data);
                    if (post.chat.split(/,/).some(element => element === post.login)) {
                      res.writeHead(200, { "Content-Type": "text/plain" });
                      res.end(JSON.stringify(chat[post.chat]));
                    } else {
                      res.writeHead(403, { "Content-Type": "text/plain" });
                      res.end("403 Forbidden");
                    }
                  }
                });
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
            }
          });
        });
        break;
      case "/post/send":
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          fs.readFile("./logins.json", (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
            } else {
              const logins = JSON.parse(data);
              const post = JSON.parse(body);
              if (post.login in logins && post.password === logins[post.login].password) {
                fs.readFile("./chat.json", (err, data) => {
                  if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                  } else {
                    const chat = JSON.parse(data);
                    if (post.chat.split(/,/).some(element => element === post.login)) {
                      if (post.chat in chat) {
                        chat[post.chat].messages.push({ sender: post.login, time: Date.now(), message: post.message });
                      } else {
                        chat[post.chat] = { name: post.name, messages: [] }
                      }
                      fs.writeFile("./chat.json", JSON.stringify(chat), err => {
                        if (err) {
                          res.writeHead(500, { "Content-Type": "text/plain" });
                          res.end("500 Internal Server Error");
                        } else {
                          res.writeHead(200, { "Content-Type": "text/plain" });
                          res.end("200 OK");
                        }
                      });
                    } else {
                      res.writeHead(403, { "Content-Type": "text/plain" });
                      res.end("403 Forbidden");
                    }
                  }
                });
              } else {
                res.writeHead(403, { "Content-Type": "text/plain" });
                res.end("403 Forbidden");
              }
            }
          });
        });
        break;
      default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
  }
}).listen(port);
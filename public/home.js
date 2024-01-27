if (/login=[A-Za-z0-9.]{3,}/.test(document.cookie)) {
  fetch("/post/login", {
    method: "POST",
    body: JSON.stringify({
      login: /login=([A-Za-z0-9.]{3,})(?:;|$)/.exec(document.cookie)[1],
      password: decodeURIComponent(/password=([A-Za-z0-9._+$!*'() %-]{3,})(?:;|$)/.exec(document.cookie)[1])
    })
  })
    .then(response => {
      if (response.status === 403) {
        location.pathname = "/login";
      }
    });
} else {
  location.pathname = "/login";
}

const login = /login=([A-Za-z0-9.]{3,})(?:;|$)/.exec(document.cookie)[1];
const password = decodeURIComponent(/password=([A-Za-z0-9._+$!*'() %-]{3,})(?:;|$)/.exec(document.cookie)[1]);

fetch("/post/chats", {
  method: "POST",
  body: JSON.stringify({
    login,
    password
  })
})
  .then(response => response.json())
  .then(async chats => {
    let win;

    async function update(chatName) {
      fetch("/post/chat", {
        method: "POST",
        body: JSON.stringify({
          login,
          password,
          chat: chatName
        })
      })
        .then(response => response.json())
        .then(chat => {
          if (win) {
            const content = win.querySelector(".window-content");
            const messages = content.querySelector(".chtcnt");
            messages.innerHTML = "";
            messages.classList.add("chtcnt");

            for (const message of chat.messages) {
              const element = document.createElement("div");
              element.classList.add("chtitm");
              if (message.sender === login) {
                element.classList.add("usrchtitm");
              }
              element.innerHTML = `<div class="chtitmlogindate">${message.sender}, ${new Date(message.time).toLocaleString()}</div>${message.message}`;
              messages.appendChild(element);
            }
          }
        });
    }

    function send(chat, message) {
      fetch("/post/send", {
        method: "POST",
        body: JSON.stringify({
          login,
          password,
          chat,
          message
        })
      });
    }

    let timer;

    function openChat(chat) {
      if (win) {
        door.closeWindow(win);
      }
      const content = document.createElement("div");
      content.classList.add("chtwin");
      const messages = document.createElement("div");
      messages.classList.add("chtcnt");
      content.appendChild(messages);
      const chtsndcnt = document.createElement("div");
      chtsndcnt.classList.add("chtsndcnt");
      const chtsndinput = document.createElement("input");
      chtsndinput.addEventListener("keydown", function (event) {
        if (event.code === "Enter" && chtsndinput.value !== "") {
          send(chat, this.value);
          this.value = "";
          update(chat);
        }
      });
      chtsndinput.classList.add("chtsndinput");
      chtsndcnt.appendChild(chtsndinput);
      chtsndbtn = document.createElement("button");
      chtsndbtn.textContent = "Wyślij";
      chtsndbtn.addEventListener("click", () => {
        chtsndinput.dispatchEvent(new Event("keydown"), { code: "Enter" });
      });
      chtsndcnt.appendChild(chtsndbtn);
      content.appendChild(chtsndcnt);
      fetch("/post/chat", {
        method: "POST",
        body: JSON.stringify({
          login,
          password,
          chat
        })
      })
        .then(response => response.json())
        .then(chat => {
          win = door.openWindow({
            title: chat.name,
            content
          });
        });
      clearInterval(timer);
      timer = setInterval(update, 1000, chat);
      update(chat);
    }

    for (const chat of chats) {
      const element = document.createElement("div");
      fetch("/post/chat", {
        method: "POST",
        body: JSON.stringify({
          login,
          password,
          chat
        })
      })
        .then(response => response.json())
        .then(chat => element.textContent = chat.name);
      element.onclick = () => openChat(chat);
      document.body.appendChild(element);
    }
  });
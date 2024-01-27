function nc() {
  const name = document.getElementById("name");
  const chat = document.getElementById("chat");
  
  if (!/^[a-z0-9.]{3,}(?:,[a-z0-9.]{3,})*$/.test(chat.value)) {
    chat.classList.add("not-allowed");
    chat.focus();
    chat.addEventListener("input", function oninput() {
      this.classList.remove("not-allowed");
      this.removeEventListener("input", oninput);
    });
    return;
  }

  if (name.value.trim() === "") {
    name.classList.add("not-allowed");
    name.focus();
    name.addEventListener("input", function oninput() {
      this.classList.remove("not-allowed");
      this.removeEventListener("input", oninput);
    });
    return;
  }

  fetch("/post/new", { method: "POST", body: JSON.stringify({
    login: /login=([A-Za-z0-9.]{3,})(?:;|$)/.exec(document.cookie)[1],
    password: decodeURIComponent(/password=([A-Za-z0-9._+$!*'() %-]{3,})(?:;|$)/.exec(document.cookie)[1]),
    name: name.value,
    chat: /login=([A-Za-z0-9.]{3,})(?:;|$)/.exec(document.cookie)[1] + "," + chat.value
  }) })
    .then(() => {
      location.pathname = "/home";
    });
}
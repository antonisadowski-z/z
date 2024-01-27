if (/login=[A-Za-z0-9.]{3,}/.test(document.cookie)) {
  fetch("/post/login", {
    method: "POST",
    body: JSON.stringify({
      login: /login=([A-Za-z0-9.]{3,})(?:;|$)/.exec(document.cookie)[1],
      password: decodeURIComponent(/password=([A-Za-z0-9._+$!*'() %-]{3,})(?:;|$)/.exec(document.cookie)[1])
    })
  })
    .then(response => {
      if (response.status === 200) {
        location.pathname = "/home";
      }
    });
}

addEventListener("scroll", () => {
  document.querySelector("#b > .zsq").style.setProperty("--size", `${Math.max(-scrollY + innerHeight - 16, 64)}px`)
});

dispatchEvent(new Event("scroll"));
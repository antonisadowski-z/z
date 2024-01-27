function signup() {
  const login = document.getElementById("login");
  const password = document.getElementById("password");

  if (!/^[a-z0-9.]{3,}$/.test(login.value)) {
    login.classList.add("not-allowed");
    login.focus();
    login.addEventListener("input", function oninput() {
      this.classList.remove("not-allowed");
      this.removeEventListener("input", oninput);
    });
    return;
  }

  fetch("/post/signup", { method: "POST", body: JSON.stringify({
    login: login.value,
    password: password.value
  })})
    .then(response => {
      if (response.status === 200) {
        document.cookie = `login=${login.value};max-age=${60 * 60 * 24 * 30}`;
        document.cookie = `password=${encodeURIComponent(password.value)};max-age=${60 * 60 * 24 * 30}`;
        location.pathname = "/home";
      } else {
        login.classList.add("not-allowed");
        login.focus();
        login.addEventListener("input", function oninput() {
          this.classList.remove("not-allowed");
          this.removeEventListener("input", oninput);
        });
      }
    });
}
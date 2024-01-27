const door = {
  openWindow(arg) {
    let element = document.createElement("div");

    if (arg?.previousWindow) {
      element.previousWindow = arg.previousWindow;
      let backButton = document.createElement("div");
      backButton.classList.add("window-back-button");
      backButton.onclick = arg.onReturn || function () {
        door.returnWindow(this.parentNode, this.parentNode.previousWindow);
      };
      backButton.innerHTML = "<svg width=\"8\" height=\"16\">\
  <path d=\"M 8 0 l -8 8 l 8 8\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(backButton);
    }

    if (arg?.tabs) {
      for (let i = 0; i < arg.tabs?.length; i++) {
        let tab = document.createElement("div");
        tab.classList.add("window-tab");
        if (i === 0) {
          tab.classList.add("active");
        }
        tab.onclick = function () {
          this.parentNode.querySelectorAll(".window-tab").forEach(element => element.classList.remove("active"));
          this.classList.add("active");
        }
        let tabTitle = document.createElement("div");
        tabTitle.appendChild(document.createTextNode(arg.tabs[i]?.title));
        tab.appendChild(tabTitle);
        let tabSubtitle = document.createElement("div");
        tabSubtitle.appendChild(document.createTextNode(arg.tabs[i]?.subtitle));
        tab.appendChild(tabSubtitle);
        element.appendChild(tab);
        let tabContent;
        if (typeof arg.tabs[i]?.content === "object") {
          tabContent = arg.tabs[i].content;
          tabContent.classList.add("window-content");
        } else {
          tabContent = document.createElement("div");
          tabContent.classList.add("window-content");
          tabContent.innerHTML = arg.tabs[i]?.content;
        }
        element.appendChild(tabContent);
      }
    } else {
      let title = document.createElement("div");
      title.classList.add("window-title");
      title.appendChild(document.createTextNode(arg?.title));
      element.appendChild(title);

      let content;
      if (typeof arg?.content === "object") {
        content = arg.content;
        content.classList.add("window-content");
      } else {
        content = document.createElement("div");
        content.classList.add("window-content");
        content.innerHTML = arg?.content;
      }
      element.appendChild(content);
    }

    if (arg?.minimizable ?? true) {
      let minimizeButton = document.createElement("div");
      minimizeButton.classList.add("window-minimize-button");
      minimizeButton.onclick = function () {
        door.minimizeWindow(this.parentNode);
      };
      minimizeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <line x1=\"0\" y1=\"16\" x2=\"16\" y2=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(minimizeButton);
    }

    if (arg?.maximizable ?? true) {
      let maximizeButton = document.createElement("div");
      maximizeButton.classList.add("window-maximize-button");
      maximizeButton.onclick = function () {
        door.maximizeWindow(this.parentNode);
      };
      maximizeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
      element.appendChild(maximizeButton);
    }

    let closeButton = document.createElement("div");
    closeButton.classList.add("window-close-button");
    closeButton.onclick = arg?.onClose || function () {
      door.closeWindow(this.parentNode);
    };
    closeButton.innerHTML = "<svg width=\"16\" height=\"16\">\
  <path d=\"M 0 0 l 16 16 m 0 -16 l -16 16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    element.appendChild(closeButton);

    for (let property in arg?.element) {
      if (arg?.element && Object.hasOwn(arg?.element, property)) {
        element[property] = arg?.element[property];
      }
    }
    element.classList.add("window");
    if (arg?.tabs) {
      element.classList.add("tabbed");
    }
    if (arg?.width) {
      element.style.setProperty("--width", arg?.width);
    }
    if (arg?.height) {
      element.style.setProperty("--height", arg?.height);
    }
    if (arg?.previousWindow) {
      let previousWindowInitialState = {
        left: window.getComputedStyle(arg.previousWindow).left,
        opacity: window.getComputedStyle(arg.previousWindow).opacity
      };
      let previousWindowFinalState = {
        left: arg.previousWindow.classList.contains("maximized") ? "-50vw" : "calc(50vw - var(--width, 50vw))",
        opacity: "0"
      };
      let progress = 0;
      let speed = 0.01;
      let increaseSpeed = true;
      function animatePreviousWindow() {
        if (speed > 0) {
          window.setTimeout(animatePreviousWindow, 10);
          arg.previousWindow.style.left = `calc(${previousWindowInitialState.left} + ${progress} * (${previousWindowFinalState.left} - ${previousWindowInitialState.left}))`;
          arg.previousWindow.style.opacity = `calc(${previousWindowInitialState.opacity} + ${progress} * (${previousWindowFinalState.opacity} - ${previousWindowInitialState.opacity}))`;
          progress += speed;
        } else {
          arg.previousWindow.style.removeProperty("left");
          arg.previousWindow.style.removeProperty("opacity");
        }
        if (speed < 0.095 && increaseSpeed) {
          speed += 0.01;
        } else {
          speed -= 0.01;
          increaseSpeed = false;
        }
      }
      animatePreviousWindow();
      arg.previousWindow.classList.add("back");
    }

    let initialState = {
      left: "50vw",
      opacity: "0"
    };
    let finalState = {
      left: element.style.left || "calc(50vw - var(--width, 50vw) / 2)",
      opacity: element.style.opacity || "1"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.opacity = `calc(${initialState.opacity} + ${progress} * (${finalState.opacity} - ${initialState.opacity}))`;
        progress += speed;
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("opacity");
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    document.body.appendChild(element);
    animate();
    return element;
  },

  returnWindow(element0, element1) {
    door.closeWindow(element0, true);
    let initialState = {
      left: window.getComputedStyle(element1).left,
      opacity: window.getComputedStyle(element1).opacity
    };
    let finalState = {
      left: element1.style.left || element1.classList.contains("maximized") ? "0vw" : "calc(50vw - var(--width, 50vw) / 2)",
      opacity: element1.style.opacity || "1"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element1.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element1.style.opacity = `calc(${initialState.opacity} + ${progress} * (${finalState.opacity} - ${initialState.opacity}))`;
        progress += speed;
      } else {
        element1.style.removeProperty("left");
        element1.style.removeProperty("opacity");
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    animate();
    element1.classList.remove("back");
  },

  closeWindow(element, noRecurse) {
    if (!noRecurse && element.previousWindow) {
      door.closeWindow(element.previousWindow);
    }

    let initialState = {
      left: window.getComputedStyle(element).left,
      opacity: window.getComputedStyle(element).opacity
    };
    let finalState = {
      left: "50vw",
      opacity: "0"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.opacity = `calc(${initialState.opacity} + ${progress} * (${finalState.opacity} - ${initialState.opacity}))`;
        progress += speed;
      } else {
        element.remove();
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    animate();
  },

  minimizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "0px",
      top: element.classList.contains("tabbed") ? "calc(100vh - 2ch" : "calc(100vh - 2em)",
      height: element.classList.contains("tabbed") ? "2ch" : "2em"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.top = `calc(${initialState.top} + ${progress} * (${finalState.top} - ${initialState.top}))`;
        element.style.height = `calc(${initialState.height} + ${progress} * (${finalState.height} - ${initialState.height}))`;
        progress += speed;
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("height");
      }
      if (speed < 0.095 && increaseSpeed) {
      let progress = 0;
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    element.querySelector(".window-minimize-button").onclick = function () {
      door.unminimizeWindow(this.parentNode);
    };
    element.querySelector(".window-minimize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"4\" width=\"12\" height=\"12\" fill=\"#0000\" stroke=\"#000\" />\
  <path d=\"M 4 0 l 12 0 l 0 12\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.add("minimized");
  },

  unminimizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: element.classList.contains("maximized") ? "0px" : "calc(50vw - var(--width, 50vw) / 2)",
      top: element.classList.contains("maximized") ? element.classList.contains("tabbed") ? "3.5em" : "0px" : element.classList.contains("tabbed") ? "calc(50vh - var(--height, 50vh) / 2 + 3.5em)" : "calc(50vh - var(--height, 50vh) / 2)",
      height: element.classList.contains("maximized") ? element.classList.contains("tabbed") ? "calc(100vh - 3.5em)" : "100vh" : element.classList.contains("tabbed") ? "calc(var(--height, 50vh) - 3.5em)" : "var(--height, 50vh)"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.top = `calc(${initialState.top} + ${progress} * (${finalState.top} - ${initialState.top}))`;
        element.style.height = `calc(${initialState.height} + ${progress} * (${finalState.height} - ${initialState.height}))`;
        progress += speed;
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("height");
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    element.querySelector(".window-minimize-button").onclick = function () {
      door.minimizeWindow(this.parentNode);
    };
    element.querySelector(".window-minimize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <line x1=\"0\" y1=\"16\" x2=\"16\" y2=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.remove("minimized");
  },

  maximizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      width: window.getComputedStyle(element).width,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "0px",
      top: element.classList.contains("tabbed") ? "3.5em" : "0px",
      width: "100vw",
      height: element.classList.contains("tabbed") ? "calc(100vh - 3.5em)" : "100vh"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.top = `calc(${initialState.top} + ${progress} * (${finalState.top} - ${initialState.top}))`;
        element.style.width = `calc(${initialState.width} + ${progress} * (${finalState.width} - ${initialState.width}))`;
        element.style.height = `calc(${initialState.height} + ${progress} * (${finalState.height} - ${initialState.height}))`;
        progress += speed;
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("width");
        element.style.removeProperty("height");
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    element.querySelector(".window-maximize-button").onclick = function () {
      door.unmaximizeWindow(this.parentNode);
    };
    element.querySelector(".window-maximize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"4\" width=\"12\" height=\"12\" fill=\"#0000\" stroke=\"#000\" />\
  <path d=\"M 4 0 l 12 0 l 0 12\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.add("maximized");
  },

  unmaximizeWindow(element) {
    let initialState = {
      left: window.getComputedStyle(element).left,
      top: window.getComputedStyle(element).top,
      width: window.getComputedStyle(element).width,
      height: window.getComputedStyle(element).height
    };
    let finalState = {
      left: "calc(50vw - var(--width, 50vw) / 2)",
      top: element.classList.contains("tabbed") ? "calc(50vh - var(--height, 50vh) / 2 + 3.5em)" : "calc(50vh - var(--height, 50vh) / 2)",
      width: "var(--width, 50vw)",
      height: element.classList.contains("tabbed") ? "calc(var(--height, 50vh) - 3.5em)" : "var(--height, 50vh)"
    };
    let progress = 0;
    let speed = 0.01;
    let increaseSpeed = true;
    function animate() {
      if (speed > 0) {
        window.setTimeout(animate, 10);
        element.style.left = `calc(${initialState.left} + ${progress} * (${finalState.left} - ${initialState.left}))`;
        element.style.top = `calc(${initialState.top} + ${progress} * (${finalState.top} - ${initialState.top}))`;
        element.style.width = `calc(${initialState.width} + ${progress} * (${finalState.width} - ${initialState.width}))`;
        element.style.height = `calc(${initialState.height} + ${progress} * (${finalState.height} - ${initialState.height}))`;
        progress += speed;
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("width");
        element.style.removeProperty("height");
      }
      if (speed < 0.095 && increaseSpeed) {
        speed += 0.01;
      } else {
        speed -= 0.01;
        increaseSpeed = false;
      }
    }
    element.querySelector(".window-maximize-button").onclick = function () {
      door.maximizeWindow(this.parentNode);
    };
    element.querySelector(".window-maximize-button").innerHTML = "<svg width=\"16\" height=\"16\">\
  <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#0000\" stroke=\"#000\" />\
  </svg>";
    animate();
    element.classList.remove("maximized");
  }
}
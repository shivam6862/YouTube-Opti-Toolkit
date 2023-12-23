(() => {
  console.log("contentScript for Youtube-screenshot-tool");
  let currentName = "screenshot_number";
  let currentImageNumber = 1;

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentName], (obj) => {
        resolve(obj[currentName] ? JSON.parse(obj[currentName]) : 1);
      });
    });
  };

  const addScreenshotButton = async () => {
    currentImageNumber = await fetchBookmarks();
    console.log("addScreenshotButton", currentImageNumber);

    const buttonImg = document.createElement("img");
    buttonImg.src = chrome.runtime.getURL("assets/icon.png");
    buttonImg.style.width = "24px";
    buttonImg.style.height = "24px";
    buttonImg.style.borderRadius = "2px";
    buttonImg.style.filter = "grayscale(100%)";
    buttonImg.style.objectFit = "contain";

    const downArrowfordecrease = document.createElement("img");
    downArrowfordecrease.src = chrome.runtime.getURL("assets/down.png");
    downArrowfordecrease.style.width = "24px";
    downArrowfordecrease.style.height = "24px";
    downArrowfordecrease.style.borderRadius = "2px";
    downArrowfordecrease.style.filter = "grayscale(100%)";
    downArrowfordecrease.style.objectFit = "contain";
    downArrowfordecrease.addEventListener("click", async () => {
      currentImageNumber = await fetchBookmarks();
      --currentImageNumber;
      chrome.storage.sync.set({
        [currentName]: JSON.stringify(currentImageNumber),
      });
    });

    const button = document.createElement("div");
    button.id = "screenshot-button-extension";
    button.prepend(buttonImg);
    button.prepend(downArrowfordecrease);
    button.style.position = "fixed";
    button.style.top = "0";
    button.style.right = "0";
    button.style.zIndex = "9999";
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.gap = "5px";
    button.style.backgroundColor = "#e6e6e6";
    button.style.color = "white";
    button.style.padding = "3px";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.fontSize = "12px";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
    button.style.outline = "none";
    button.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
    document.body.appendChild(button);

    buttonImg.addEventListener("click", async () => {
      currentImageNumber = await fetchBookmarks();
      console.log("button clicked");
      const video = document.querySelector("video");
      if (video.src != "") {
        console.log("video found");
        const title = document
          .getElementsByClassName("style-scope ytd-watch-metadata")[1]
          .innerText.substring(0, 40);
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const image = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = `${currentImageNumber}.${title}.png`;
        a.href = image;
        a.click();
        a.remove();
        canvas.remove();
        console.log("screenshot taken");
        ++currentImageNumber;

        chrome.storage.sync.set({
          [currentName]: JSON.stringify(currentImageNumber),
        });
      } else {
        console.log("video not found");
      }
    });

    chrome.storage.sync.set({
      [currentName]: JSON.stringify(currentImageNumber),
    });
  };

  function delayedFunction() {
    console.log("delayedFunction");
    const video = document.querySelector("video");
    if (video) {
      console.log("video found");
      addScreenshotButton();
    } else {
      console.log("video not found");
    }
  }
  setTimeout(delayedFunction, 2000);

  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type, value, videoId } = obj;
    console.log(type, value, videoId);
    if (type === "UPDATE") {
      chrome.storage.sync.set({
        [currentName]: JSON.stringify(value),
      });
      currentImageNumber = value;
      response("message received and updated");
    } else if ("GET") {
      response(currentImageNumber);
    } else {
      console.log("message received but not update");
    }
  });
})();

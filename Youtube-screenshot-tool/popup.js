import { getActiveTabURL } from "./utils.js";

const responseWorkedfine = (response = "Response failed to come!") => {
  console.log(response);
};

const onChangecurrentImageNumber = async (e) => {
  const activeTab = await getActiveTabURL();
  const currentImageNumber = e.target.value;

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "UPDATE",
      value: currentImageNumber,
    },
    responseWorkedfine
  );
};

const responseWorkedfineSetcurrentNumber = (response = "1") => {
  document.getElementById("number").value = response;
};

const getcurrentImageNumber = async () => {
  const activeTab = await getActiveTabURL();
  await chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "GET",
      value: "value",
    },
    responseWorkedfineSetcurrentNumber
  );
  return 1;
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch")) {
    const title = document.getElementsByClassName("title")[0];
    title.innerHTML += " !" + currentVideo;
    getcurrentImageNumber();
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title">This is not a youtube video page.</div>';
  }
});

const input = document.getElementById("number");
input.addEventListener("keyup", onChangecurrentImageNumber);

(() => {
  console.log("contentScript.js");
  function delayedFunction() {
    var elements = document.getElementsByClassName(
      "style-scope ytd-watch-flexy"
    );
    if (elements.length >= 12) {
      elements[11].style.overflow = "hidden";
      console.log("overflow hidden added");
    } else {
      console.error(
        "Element not found or insufficient elements with the specified class."
      );
    }
  }
  setTimeout(delayedFunction, 7000);
})();

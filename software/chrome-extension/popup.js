const readLaterButtonEl = document.getElementById("read-later-button");

readLaterButtonEl.addEventListener("click", () => {
  console.log("clicked");
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      // since only one tab should be active and in the current window at once
      // the return variable should only have one entry
      var activeTab = tabs[0];

      console.log(activeTab);

      readLaterButtonEl.textContent = "Saving...";
      fetch(`http://localhost:8080/inbox/submit?url=${activeTab.url}`)
          .then((response) => {
              readLaterButtonEl.textContent = "Saved!";
          })
          .catch(e => {
              readLaterButtonEl.textContent = "Error";
          });
    }
  );
});

const apiKeyEl = document.getElementById("api-key");

apiKeyEl.addEventListener("keyup", (e) => {
  localStorage.setItem("apikey", e.target.value);
  console.log("setting", e.target.value);
});

apiKeyEl.value = localStorage.getItem("apikey");

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
      fetch("http://localhost:5298/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // 'x-api-key':
        },
        // mode: "no-cors",
        body: JSON.stringify({
          query: `mutation CreateBookmark($url: String!, $tags: [String!]) {
        bookmarkCreate(url: $url, tags: $tags) {
          id
          name
        }
      }`,
          variables: {
            url: activeTab.url,
            tags: ["read-later"],
          },
        }),
      }).then((response) => {
        console.log("graphql response", response);
        if (response.ok) {
          readLaterButtonEl.textContent = "Success!";
        } else {
          readLaterButtonEl.textContent = "Failed";
        }
      });
    }
  );
});

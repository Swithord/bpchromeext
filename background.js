chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.url.includes("netflix.com")) {
      chrome.tabs.update(details.tabId, { url: "https://leetcode.com" });
    }
  });
  
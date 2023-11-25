chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldRedirect()) { // Assuming this is your function to check if blocking is active
      return {redirectUrl: "https://leetcode.com"}; // Redirect to LeetCode
    }
  },
  {urls: ["*://*.netflix.com/*"]},
  ["blocking"]
);

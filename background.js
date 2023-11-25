chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldRedirect()) { // Assuming this is your function to check if blocking is active
      return {redirectUrl: "https://leetcode.com"}; // Redirect to LeetCode
    }
  },
  {urls: ["*://*.netflix.com/*"]},
  ["blocking"]
);


function redirectToLeetcode(callback) {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Retrieve data from chrome.storage
  chrome.storage.local.get(['count', 'time'], function(result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback(false);
    } else {
      const count = result.count;
      const storedTime = result.time;

      // Check if the stored time is within the past 12 hours
      if (currentTime - storedTime <= 12 * 60 * 60 * 1000) {
        callback(false);
      } else {
        callback(true);
      }
    }
  });
}

redirectToLeetcode(function(shouldRedirect) {
  if (shouldRedirect) {
    console.log('Redirecting to LeetCode');
    window.location.href = 'https://leetcode.com';
  } else {
    console.log('Not redirecting');
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.url.includes("netflix.com")) {
      chrome.tabs.update(details.tabId, { url: "https://leetcode.com" });
    }
  });


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
  
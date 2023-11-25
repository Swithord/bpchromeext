chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldRedirect()) { // Assuming this is your function to check if blocking is active
      return {redirectUrl: "https://leetcode.com"}; // Redirect to LeetCode
    }
  },
  {urls: ["*://*.netflix.com/*"]},
  ["blocking"]
);

// Event listener for setting username
window.addEventListener('load', function() {
  document.getElementById("submit").addEventListener("click", function() {
      var username = document.getElementById("username").value;
      chrome.storage.sync.set({'username': username}, function() {
          console.log('Set username to ' + username);
      });
  });
});


function redirectToLeetcode(callback) {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Retrieve data from chrome.storage
  chrome.storage.local.get(['time'], function(result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback(false);
    } else {
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


// Obtains the file that contains count and time and updates them if at least one changed
function compareValues(result) {
  problemsSolved = getLeetCodeTotalSolved()
  if (!result || Object.keys(result).length === 0) {
    // If the result object is empty or doesn't exist, create it
    const defaultValueForCount = problemsSolved;
    const defaultValueForTime = new Date().getTime();
    result = { count: defaultValueForCount, time: defaultValueForTime };
  }

  // Check if the count has changed
  if (result.count !== problemsSolved) {
    // If it has, update the count and reset the time
    result.count = problemsSolved;
    result.time = new Date().getTime();
  }
}

// Set default values

chrome.storage.sync.get(['count', 'time'], compareValues);


// API Call to leetcode-api that obtains the data for the leetcode user

async function getLeetCodeTotalSolved() {
  // Retrieve username from Chrome Storage
  const result = await new Promise(resolve => {
    chrome.storage.sync.get(['username'], resolve);
  });

  const username = result.username;

  // Check if the username exists
  if (!username) {
    console.error('Username not found in Chrome Storage');
    return null;
  }

  // Construct the API URL
  const apiUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

  try {
    // Make the API call using async/await
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Return the totalSolved value
    return data.totalSolved;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}      
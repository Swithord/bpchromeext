// Event listener for setting username
window.addEventListener('load', function() {
  document.getElementById("submit").addEventListener("click", function() {
      var username = document.getElementById("username").value;
      chrome.storage.sync.set({'username': username}, function() {
          console.log('Set username to ' + username);
      });
  });
});


async function shouldRedirect() {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();

  // Retrieve data from chrome.storage
  chrome.storage.sync.get(['time'], function(result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return false;
    } else {
      const storedTime = result.time;

      console.log(storedTime)

      // Check if the stored time is within the past 12 hours
      if (currentTime - storedTime <= 12 * 60 * 60 * 1000) {
        console.log("shouldRedirect: false, let's watch netflix!")
        return false;
      } else {
        console.log("shouldRedirect: true, last time is more than 12 hours")
        return true;
      }
    }
  });
  console.log("shouldRedirect: true")
  return true;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    chrome.storage.sync.get(['count', 'time'], compareValues);
    if (shouldRedirect()) { // Assuming this is your function to check if blocking is active
      return {redirectUrl: "https://leetcode.com"}; // Redirect to LeetCode
    }
  },
  {urls: ["*://*.netflix.com/*"]},
  ["blocking"]
);


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

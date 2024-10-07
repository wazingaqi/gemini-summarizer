document.getElementById('summarize-btn').addEventListener('click', async () => {
  // Get the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject content script to extract the page's text content
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractTextContent
  }, async (injectionResults) => {
    const pageContent = injectionResults[0].result;

    // Make an API call to Google Cloud's Natural Language API
    const summary = await getSummaryFromGoogle(pageContent);

    // Display the summary in the textarea
    document.getElementById('summary').value = summary;
  });
});

// Function to extract text from the page (content script)
function extractTextContent() {
  return document.body.innerText;
}

// Function to call Google Cloud's Natural Language API to get the summary
async function getSummaryFromGoogle(text) {
  const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Replace with your Google Cloud API Key
  const apiUrl = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`;

  const requestBody = {
    document: {
      type: 'PLAIN_TEXT',
      content: text
    },
    encodingType: 'UTF8'
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return processGoogleResponse(data);
}

// Function to process the Google API response and summarize
function processGoogleResponse(data) {
  // Process the response to extract key entities or main points
  const entities = data.entities.map(entity => entity.name).join(', ');

  // You can further enhance this by integrating other NLP logic
  return `Key Points: ${entities}`;
}

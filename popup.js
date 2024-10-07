document.getElementById('summarize-btn').addEventListener('click', async () => {
  // Get the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject content script to extract the page's text content
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractTextContent
  }, async (injectionResults) => {
    const pageContent = injectionResults[0].result;

    // Make an API call to Gemini (OpenAI's API) to summarize the content
    const summary = await getSummaryFromGemini(pageContent);

    // Display the summary in the textarea
    document.getElementById('summary').value = summary;
  });
});

// Function to extract text from the page (content script)
function extractTextContent() {
  return document.body.innerText;
}

// Function to call OpenAI's API (Gemini model) to get the summary
async function getSummaryFromGemini(text) {
  const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API Key
  const apiUrl = 'https://api.openai.com/v1/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4', // Assuming Gemini is an alias or future version of GPT-4
      prompt: `Summarize the following text:\n\n${text}`,
      max_tokens: 200
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

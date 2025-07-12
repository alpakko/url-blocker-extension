const apiKeyInput = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

// Load saved key on open
chrome.storage.local.get(["apiKey"], (result) => {
  if (result.apiKey) {
    apiKeyInput.value = result.apiKey;
  }
});

saveBtn.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    status.textContent = "API key cannot be empty.";
    return;
  }
  chrome.storage.local.set({ apiKey }, () => {
    status.textContent = "API key saved!";
    setTimeout(() => {
      status.textContent = "";
    }, 2000);
  });
});

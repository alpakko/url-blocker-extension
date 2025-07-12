chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = details.url;

  // Get stored API key
  chrome.storage.local.get(["apiKey"], async (result) => {
    const apiKey = result.apiKey;
    if (!apiKey) {
      console.warn("API key not set - cannot check URLs.");
      return;
    }

    try {
      const backend = "https://api.urlquery.net/public/v1/reputation/check/?query=" + encodeURIComponent(url);
      const res = await fetch(backend, {
        headers: {
          "accept": "application/json",
          "x-apikey": apiKey
        }
      });
      const data = await res.json();

      if (data.verdict === "scam") {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("block.html") + `?blocked=${encodeURIComponent(url)}`
        });
      }
    } catch (e) {
      console.error("URL check failed:", e);
    }
  });
}, { url: [{ urlMatches: ".*" }] });

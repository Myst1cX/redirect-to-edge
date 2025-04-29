chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const url = tab.url;

        // Check if the URL matches one of the configured streaming sites
        const shouldRedirect = url.startsWith("https://open.spotify.com/") ||
                               url.startsWith("https://www.netflix.com/") ||
                               url.startsWith("https://www.hotstar.com/") ||
                               url.startsWith("https://www.disneyplus.com/") ||
                               url.startsWith("https://www.primevideo.com/") ||
                               url.startsWith("https://www.max.com/") ||
                               url.startsWith("https://tidal.com/");

        // If we should redirect, initiate the process
        if (shouldRedirect) {
            // Check if it's already redirected for this session (using sessionStorage)
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    // If the page has not been redirected before in this session, redirect it
                    if (!sessionStorage.getItem("redirected")) {
                        const currentURL = window.location.href;
                        const edgeURL = "microsoft-edge:" + currentURL;

                        // Set a flag in sessionStorage to prevent further redirects in the same session
                        sessionStorage.setItem("redirected", "true");

                        // Perform the redirection to Microsoft Edge
                        window.location.href = edgeURL;
                    }
                }
            }, () => {
                // After redirection, set a delay before closing the tab (3 seconds)
                setTimeout(() => {
                    chrome.tabs.remove(tabId);
                }, 3000); // 3000ms = 3 seconds
            });
        }
    }
});

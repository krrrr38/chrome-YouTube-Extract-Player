var ids = [];
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    ids = request.ids;
    chrome.browserAction.setBadgeText({text: ids.length + ""});
});

chrome.tabs.onSelectionChanged.addListener(function(tabid){
    chrome.tabs.getSelected(null, function(tab) {
        // notify page changed
        chrome.tabs.sendRequest(tab.id, {}, function(response) {});
    });
});

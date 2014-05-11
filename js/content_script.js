function getYoutubeIds() {
    var ids = [];
    ids = ids.concat(aTagYoutubeIds());
    ids = ids.concat(iframeYoutubeIds());
    ids = ids.concat(embedYoutubeIds());
    ids = unique(ids);
    return ids;
};

function aTagYoutubeIds() {
    var aTags = $('a'),
        youtubeRegex = "http://www\.youtube\.com/watch\\?v=([^&]*).*",
        ids = [];
    for(var i = 0; i < aTags.size(); ++i) {
        var href = aTags[i].href;
        var found = href.match(youtubeRegex);
        if (found) {
            ids.push(found[1]);
        }
    }
    return ids;
};

function iframeYoutubeIds() {
    var iframes = $('iframe'),
        youtubeRegex = "http://www\.youtube\.com/embed/([^?]*).*",
        ids = [];
    for(var i = 0; i < iframes.size(); ++i) {
        var href = iframes[i].src;
        var found = href.match(youtubeRegex);
        if (found) {
            ids.push(found[1]);
        }
    }
    return ids;
};

function embedYoutubeIds() {
    var embeds = $('embed'),
        youtubeRegex = "http://www\.youtube\.com/v/([^?]*).*",
        ids = [];
    for(var i = 0; i < embeds.size(); ++i) {
        var href = embeds[i].src;
        var found = href.match(youtubeRegex);
        if (found) {
            ids.push(found[1]);
        }
    }
    return ids;
}

function unique(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

chrome.extension.sendRequest({ids: getYoutubeIds()}, function(response) {});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // change contents based on page changed
    chrome.extension.sendRequest({ids: getYoutubeIds()});
});

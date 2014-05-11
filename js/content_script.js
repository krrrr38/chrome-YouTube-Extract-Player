function getYoutubeIds() {
    var ids = [];

    ids = ids.concat(
        aTagYoutubeIds(),
        iframeYoutubeIds(),
        embedYoutubeIds()
    );
    return unique(ids);
};

function extractYoutubeIds(tags, youtubeRegex, attrFunc) {
    var ids = [];
    for(var i = 0; i < tags.size(); ++i) {
        var href = attrFunc(tags[i]);
        var found = href.match(youtubeRegex);
        if (found) {
            ids.push(found[1]);
        }
    }
    return ids;
}

function aTagYoutubeIds() {
    return extractYoutubeIds(
        $('a'),
        "http://www\.youtube\.com/watch\\?v=([^&]*).*",
        getHref
    );
};

function iframeYoutubeIds() {
    return extractYoutubeIds(
        $('iframe'),
        "http://www\.youtube\.com/embed/([^?]*).*",
        getSrc
    );
};

function embedYoutubeIds() {
    return extractYoutubeIds(
        $('embed'),
        "http://www\.youtube\.com/v/([^?]*).*",
        getSrc
    );
}

function unique(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

var getHref = function(tag) {
    return tag.href;
};

var getSrc = function(tag) {
    return tag.src;
};

chrome.extension.sendRequest({ids: getYoutubeIds()}, function(response) {});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // change contents based on page changed
    chrome.extension.sendRequest({ids: getYoutubeIds()});
});

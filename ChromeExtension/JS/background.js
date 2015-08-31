/**
 *
 * 限制上微博
 */

function checkForValidUrl(tabId, changeInfo, tab) {
    var site_filter = storage().get("site_filter");
    if (!site_filter) {
        return;
    }
    var date = new Date();
    var __NO = false;
    for (var i in site_filter) {
        if (tab.url.indexOf(site_filter[i]) > -1) {
            __NO = true;
            break;
        }
    }
    if (__NO) {

        //9点到12点，下雨一点到晚上10点禁止上
        if ((date.getHours() > 8 && date.getHours() < 12) || (date.getHours() > 13 && date.getHours() < 22)) {
            chrome.tabs.update(tabId, {url: "http://www.google.com"});
        }
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

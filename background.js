chrome.browserAction.onClicked.addListener(function (tab) {
    getOptions().then(function (options) {
        if (typeof options === 'undefined' ||
            options === null ||
            typeof options.baseUrl === 'undefined' ||
            options.baseUrl === null ||
            options.baseUrl.length < 2) { 
            promptToNavigateToOptions();
        } else {
            //Navigate to ticket
            var ticket = window.prompt("Please enter the Stratify Error ID", "Example: ca5dca2e-49b3-438f-b3e0-d4e69da3012d");
            navigateToTicket(ticket, options);
        }
    });; 
});
function getSanitizedBaseUrl(url) {

    if (typeof url === 'undefined' || url === null) {
        throw Error("Url is null or undefined!");
    }
    // check for http
    if (url.indexOf('http') === -1) {
        url = 'http://' + url;
    }
    // check for tailing slash
    var lastCharacter = url.substr(url.length - 1);
    if (lastCharacter !== '/') {
        url = url + '/';
    }
    return url;
}
function promptToNavigateToOptions() {
    if (confirm('You need to configure this plugin first. Would you like to do that now?')) {
        chrome.tabs.create({
            url: '/options/options.html'
        });
    } else {
        return;
    }
}

function navigateToTicket(guid, options) {
    if (typeof guid !== 'undefined' && guid !== null) {
        var url = getSanitizedBaseUrl(options.baseUrl) + "?log_q=where(" + guid +")&last=Last%2020%20Minutes";
        if (options.openInNewTab == 'true') {
            chrome.tabs.create({
                url: url
            });
        } else {
            chrome.tabs.update({
                url: url
            });
        }

    }
}
function getOptions() {
    return new Promise(function (successCallback) {
        chrome.storage.sync.get(function (settings) {
            var options = new Options(settings.baseUrl, settings.ticketPrefix, settings.openInNewTab);
            successCallback(options);
        });
    });
   
}
function Options(baseUrl, ticketPrefix, openInNewTab) {
    var self = this;
    self.baseUrl = baseUrl;
    self.ticketPrefix = ticketPrefix;
    self.openInNewTab = openInNewTab;
    return self;
}

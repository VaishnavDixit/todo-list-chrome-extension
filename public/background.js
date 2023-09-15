const getColor = (length) =>
    length <= 4 ? "#28a745" : length <= 7 ? "#ffc107" : "#dc3545";

chrome.storage.sync.get(["tasks"], (res) => {
    chrome.action.setBadgeText(
        {
            text: res.tasks.length ? res.tasks.length.toString() : "",
        },
        () => {
            chrome.action.setBadgeBackgroundColor({
                color: getColor(res.tasks.length),
            });
        }
    );
});

chrome.storage.onChanged.addListener((changes) => {
    chrome.action.setBadgeText(
        {
            text: changes?.tasks?.newValue?.length
                ? (changes?.tasks?.newValue?.length).toString()
                : "",
        },
        () => {
            chrome.action.setBadgeBackgroundColor({
                color: getColor(changes?.tasks?.newValue?.length),
            });
        }
    );
});

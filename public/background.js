const getColor = (length) => (length <= 4 ? "#28a745" : length <= 7 ? "#ffc107" : "#dc3545");

const setBadge = (value) => {
    chrome.action.setBadgeText(
        {
            text: value,
        },
        () => {
            chrome.action.setBadgeBackgroundColor({
                color: getColor(value),
            });
        }
    );
};

chrome.windows.onCreated.addListener(() => {
    chrome.storage.sync.get(["tasks"], (res) => {
        setBadge(res.tasks && res.tasks.length ? res.tasks.length.toString() : "");
    });
});

chrome.storage.onChanged.addListener((changes) => {
    if (!changes.tasks) return;
    setBadge(
        changes.tasks && changes.tasks.newValue?.length
            ? (changes?.tasks?.newValue?.length).toString()
            : ""
    );
});

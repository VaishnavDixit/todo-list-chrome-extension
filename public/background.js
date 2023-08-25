chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        "mode": "stopped",
        "time": 15 * 60,
        "timePresets": {"time": 15 * 60},
    });
});

chrome.windows.onRemoved.addListener(() => {
    chrome.storage.local.get(["time", "timePresets"], (res) => {
        chrome.alarms.clear("alarm", () => {
            chrome.storage.local.set({
                "mode": "stopped",
                "time": res.timePresets,
            });
        });
        chrome.action.setBadgeText({
            text: "",
        });
    });
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get(["time", "timePresets"], (res) => {
        if (res.time == 1) {
            chrome.alarms.clear("alarm", () => {
                chrome.action.setBadgeText({
                    text: "Done.",
                });
                chrome.storage.local.set({
                    "mode": "stopped",
                    "time": res.timePresets,
                });
            });
        } else {
            chrome.storage.local.set({"time": res.time - 1}, () => {
                chrome.action.setBadgeText({
                    text: `${
                        (res.time - 1) >= 3600
                            ? String(Math.floor((res.time - 1) / 3600)) + "h"
                            : (res.time - 1) >= 60
                            ? String(Math.floor(((res.time - 1) % 3600) / 60)) +
                              "m"
                            : String((res.time - 1) % 60) + "s"
                    }`,
                });
            });
        }
    });
});

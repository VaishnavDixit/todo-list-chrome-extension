chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        "mode": "stopped",
        "time": 20 * 60,
        "timePresets": {"time": 20 * 60},
    });
});

chrome.windows.onRemoved.addListener(() => {
    chrome.storage.local.get(["time", "timePresets"], (res) => {
        chrome.alarms.clear("alarm", () => {
            chrome.storage.local.set({
                "mode": "stopped",
                "time": res.timePresets ?? 0,
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
                    text: "",
                });
                chrome.storage.local.set({
                    "mode": "stopped",
                    "time": res.timePresets ?? 0,
                });
            });
        } else {
            chrome.storage.local.set({"time": res.time - 1}, () => {
                const t = res.time - 1;
                chrome.action.setBadgeText({
                    text: `${
                        t >= 3600
                            ? String(Math.floor(t / 3600)) + "h"
                            : t >= 60
                            ? String(Math.floor((t % 3600) / 60)) +
                              "m"
                            : String(t % 60) + "s"
                    }`,
                });
            });
        }
    });
});

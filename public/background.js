console.log("hello from background.js");
chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed");
    chrome.storage.local.set(
        {
            "mode": "stopped",
            "time": 15 * 60,
            "timePresets": {"time": 15 * 60},
            "timeSelected": 1,
        },
        () => {
            console.log("set BG.js after installing.");
        }
    );
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("alarm hits");
    chrome.storage.local.get(["time"], (res) => {
        console.log("get in BG.js, res=", res);
        chrome.storage.local.set({"time": res.time - 1}, () => {
            // chrome.action.setBadgeText({
            //     text: `${Math.floor(res.time / 60)}:${
            //         res.time % 60
            //     }`,
            // });
        });
    });
});

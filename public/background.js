console.log("hello from background.js");
chrome.storage.local.set({
    "mode": "stopped",
    "time": 15*60,
    "timePresets": {"time": 15*60},
    "timeSelected": 1,
});
chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(["time"], (res) => {
        chrome.storage.local.set({"time": res.time - 1});
    });
});

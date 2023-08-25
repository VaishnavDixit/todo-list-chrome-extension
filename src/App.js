/*global chrome*/
/*global local*/

import {
    faCheck,
    faPlay,
    faStop,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {ProgressBar} from "react-bootstrap";
import "./App.scss";

function App() {
    const [time, setTime] = useState();
    const [initialTime, setInitialTime] = useState(0);
    const [displayMode, setDisplayMode] = useState("stopped");
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        chrome.storage.local.get(
            ["mode", "time", "timePresets"],
            (res) => {
                setDisplayMode(res.mode);
                setTime(res.time || 0);
                setInitialTime(res.timePresets.time);
            }
        );
        chrome.storage.onChanged.addListener((changes) => {
            setTime(changes.time.newValue);
            if (changes.mode) setDisplayMode(changes.mode.newValue);
            if (changes.timePresets)
                setInitialTime(changes.timePresets.newValue.time);
        });
    }, []);
    const start = () => {
        chrome.alarms.create(
            "alarm",
            {
                periodInMinutes: 1.0 / 60,
            },
            () => {
                chrome.action.setBadgeText({
                    text: `${
                        time >= 3600
                            ? String(Math.floor(time / 3600)) + "h"
                            : time >= 60
                            ? String(Math.floor((time % 3600) / 60)) +
                              "m"
                            : String(time % 60) + "s"
                    }`,
                });
                chrome.storage.local.set(
                    {
                        "mode": "started",
                        "time": initialTime,
                    },
                    () => {
                        setDisplayMode("started");
                        setIsEditing(false);
                    }
                );
            }
        );
    };

    const stop = () => {
        chrome.alarms.clear("alarm", () => {
            chrome.storage.local.set({
                "mode": "stopped",
                "time": initialTime,
            });
            chrome.action.setBadgeText({
                text: "",
            });
        });
    };

    const editClickHandler = () => {
        setIsEditing(true);
    };

    const doneClickHandler = () => {
        setIsEditing(false);
    };

    const inputOnChangeListener = (value) => {
        if (value > 0 && value < 200) {
            chrome.storage.local.set({
                "time": value * 60,
                "timePresets": {"time": value * 60},
            });
        }
    };

    return (
        <div className="App p-2" style={{width: "200px"}}>
            <p className="text-center h4">Timer</p>
            {displayMode != "started" ? (
                <>
                    <div className="d-flex justify-content-center mb-2">
                        {isEditing ? (
                            <input
                                type="number"
                                min={0}
                                max={120}
                                defaultValue={initialTime / 60}
                                style={{textAlign: "center"}}
                                onChange={({target: {value}}) =>
                                    inputOnChangeListener(value)
                                }
                            />
                        ) : (
                            <label for="html">
                                {initialTime / 60} min
                            </label>
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            type="button"
                            className="btn btn-sm btn-success me-2"
                            onClick={start}
                        >
                            <FontAwesomeIcon icon={faPlay} /> Start
                        </button>
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={doneClickHandler}
                                >
                                    <FontAwesomeIcon icon={faCheck} />{" "}
                                    Done
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-warning"
                                    onClick={editClickHandler}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p className="text-center mb-0">
                        {`${
                            time >= 3600
                                ? String(Math.floor(time / 3600)) +
                                  "h"
                                : ""
                        } ${
                            time > 60
                                ? String(
                                      Math.floor((time % 3600) / 60)
                                  ) + "m"
                                : ""
                        } ${time % 60}s`}
                    </p>
                    <ProgressBar
                        striped
                        animated
                        now={((time / initialTime) * 100).toFixed(2)}
                        // label={
                        //     time < 60
                        //         ? `${time % 60}s`
                        //         : `${Math.floor(time / 60)}m ${
                        //               time % 60
                        //           }s`
                        // }
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-danger mt-2 mx-auto d-block"
                        onClick={stop}
                    >
                        <FontAwesomeIcon icon={faStop} /> Stop
                    </button>
                </>
            )}
            {/* <p className="mt-2 mb-0">time: {time}</p>
            <p className="mb-0">initialTime: {initialTime}</p>
            <p className="mb-0">displayMode: {displayMode}</p>
            <p className="mb-0">isEditing: {isEditing}</p>
            <p className="mb-0">toChangeTime: {toChangeTime}</p>
            <p className="mb-0">
                ProgressBar percentage:{" "}
                {((time / initialTime) * 100).toFixed(2)}
            </p>
            <p style={{whiteSpace: "pre-wrap"}}>
                allStorage: {JSON.stringify(allStorage)}
            </p> */}
        </div>
    );
}

export default App;

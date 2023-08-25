/*global chrome*/
/*global local*/

import {
	faCheck,
	faEdit,
	faPlay,
	faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import "./App.scss";

function App() {
    const [time, setTime] = useState();
    const [initialTime, setInitialTime] = useState(0);
    const [displayMode, setDisplayMode] = useState("stopped");
    const [isEditing, setIsEditing] = useState(false);
    const [timeDraft, setTimeDraft] = useState(-1);
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
            if (changes.time) setTime(changes.time.newValue);
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
                const finalisedTime =
                    timeDraft === -1 ? initialTime : timeDraft;
                chrome.storage.local.set(
                    {
                        "mode": "started",
                        "time": finalisedTime,
                        "timePresets": {
                            "time": finalisedTime,
                        },
                    },
                    () => {
                        setDisplayMode("started");
                        setIsEditing(false);
                        chrome.action.setBadgeText({
                            text: `${
                                finalisedTime >= 3600
                                    ? String(
                                          Math.floor(
                                              finalisedTime / 3600
                                          )
                                      ) + "h"
                                    : finalisedTime >= 60
                                    ? String(
                                          Math.floor(
                                              (finalisedTime % 3600) /
                                                  60
                                          )
                                      ) + "m"
                                    : String(finalisedTime % 60) + "s"
                            }`,
                        });
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
        setInitialTime(timeDraft === -1 ? initialTime : timeDraft);
        setIsEditing(false);
    };

    const inputOnChangeListener = (value) => {
        if (value <= 0 || value >= 1000) {
            setTimeDraft(-1);
        } else setTimeDraft(value * 60);
    };

    return (
        <div className="App p-2" style={{width: "200px"}}>
            <p className="text-center heading h4">Timer</p>
            {displayMode != "started" ? (
                <>
                    <div className="d-flex justify-content-center mb-2">
                        {isEditing ? (
                            <input
                                type="number"
                                min={0}
                                defaultValue={initialTime / 60}
                                onChange={({target: {value}}) =>
                                    inputOnChangeListener(value)
                                }
                            />
                        ) : (
                            <div className="timeDisplay">
                                {initialTime / 60} min
                            </div>
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
                                    <FontAwesomeIcon icon={faEdit} />{" "}
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p className="text-center mb-0 timeDisplay">
                        {`${
                            time >= 3600
                                ? String(Math.floor(time / 3600)) +
                                  "h"
                                : ""
                        } ${
                            time >= 60
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
            {/* <p className="mb-0">timeDraft: {timeDraft}</p>
            <p className="mt-2 mb-0">time: {time}</p>
            <p className="mb-0">displayMode: {displayMode}</p>
            <p className="mb-0">isEditing: {isEditing}</p>
            <p className="mb-0">initialTime: {initialTime}</p>
            <p className="mb-0">
                ProgressBar percentage:{" "}
                {((time / initialTime) * 100).toFixed(2)}
            </p> */}
        </div>
    );
}

export default App;

/*global chrome*/
/*global local*/

import "bootstrap/dist/css/bootstrap.min.css";
import {Button, ProgressBar} from "react-bootstrap";
import {
    faPlay,
    faCheck,
    faStop,
} from "@fortawesome/free-solid-svg-icons";
import "./App.scss";
import {useEffect, useState, useTransition} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function App() {
    console.log("popup start...");
    const [allStorage, setAllStorage] = useState({});
    const [time, setTime] = useState();
    const [initialTime, setInitialTime] = useState(0);
    const [displayMode, setDisplayMode] = useState("stopped");
    const [isEditing, setIsEditing] = useState(false);
    const [toChangeTime, setToChangeTime] = useState(0);
    const [radioSelected, setRadioSelected] = useState(-1);
    useEffect(() => {
        chrome.storage.local.get(
            ["mode", "time", "timeSelected", "timePresets"],
            (res) => {
                console.log(
                    "get Function fired, res =",
                    JSON.stringify(res)
                );
                setAllStorage(res);
                setDisplayMode(res.mode);
                setTime(res.time || 0);
                setInitialTime(res.timePresets.time);
                setRadioSelected(res.timeSelected);
            }
        );
        chrome.storage.onChanged.addListener((changes, namespace) => {
            console.log("changes, changes=", changes);
            if (changes.time) {
                if (changes.time.newValue == 0)
                    chrome.alarms.clear("alarm", () => {
                        console.log(56);
                        chrome.storage.local.set(
                            {
                                "mode": "stopped",
                                "time": initialTime,
                            },
                            () => {
                                console.log("time==0, stopping.");
                            }
                        );
                    });

                setTime(changes.time.newValue);
            }
            if (changes.mode) setDisplayMode(changes.mode.newValue);
            if (changes.timePresets)
                setInitialTime(changes.timePresets.newValue.time);
        });
    }, []);

    const radioOnClickListener = (t) => {
        console.log("radio clicked, t=", t);
        chrome.storage.local.set({"time": t}, () => {
            console.log("radio clicked. data updated.");
        });
    };

    console.log("before onChange line");

    console.log("after onChange line");

    const start = () => {
        console.log("start Clicked.");
        chrome.alarms.create(
            "alarm",
            {
                periodInMinutes: 1.0 / 60,
            },
            () => {
                chrome.storage.local.set(
                    {
                        "mode": "started",
                        "time": initialTime,
                    },
                    () => {
                        console.log(
                            "values set after clicking start."
                        );
                        setDisplayMode("started");
                        setIsEditing(false);
                    }
                );
            }
        );
    };

    const stop = () => {
        console.log("stop Clicked.");
        chrome.alarms.clear("alarm", () => {
            chrome.storage.local.set(
                {
                    "mode": "stopped",
                    "time": initialTime,
                },
                () => {
                    console.log("stop clicked. alarm cleared.");
                }
            );
        });
    };

    const editClickHandler = () => {
        setIsEditing(true);
    };

    const doneClickHandler = () => {
        setIsEditing(false);
    };

    const inputOnChangeListener = (value) => {
        // setToChangeTime(value * 60);
        if (value > 0 && value < 200) {
            chrome.storage.local.set(
                {
                    "time": value * 60,
                    "timePresets": {"time": value * 60},
                },
                () => {
                    console.log("edit done, data updated.");
                }
            );
        }
    };

    console.log("popup End");

    return (
        <div className="App p-2" style={{width: "200px"}}>
            <p className="text-center h4">Timer</p>
            {displayMode != "started" ? (
                <>
                    <div className="d-flex justify-content-center mb-2">
                        {/* <input
                            className="radioBtn"
                            type="radio"
                            id="idTime1"
                            name="timeGroup"
                            checked={radioSelected == 1}
                            onClick={() =>
                                radioOnClickListener(initialTime)
                            }
                        /> */}
                        {isEditing ? (
                            <input
                                type="number"
                                min={0}
                                max={120}
                                defaultValue={initialTime / 60}
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
                    <ProgressBar
                        striped
                        now={((time / initialTime) * 100).toFixed(2)}
                        label={`${Math.floor(time / 60)}m ${
                            time % 60
                        }s`}
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

// function App() {
//     const [name, setName] = useState("");
//     const [nameInput, setNameInput] = useState("");
//     // chrome.storage.sync.get(["name"], (res) => {
//     //     console.log(res);
//     //     setName(res.name ?? "pp");
//     // });
//     const changeClickHandler = () => {
//         chrome.storage.sync.set({"name": nameInput});
//     };
//     return (
//         <div className="App">
//             <p>name is saved as {name}</p>
//             <input type="text" onChange={(e) => setNameInput(e.target.value)}></input>
//             <button onClick={changeClickHandler}>update name</button>
//         </div>
//     );
// }

export default App;

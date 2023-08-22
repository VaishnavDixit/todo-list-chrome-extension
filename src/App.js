/*global chrome*/
/*global local*/

import "bootstrap/dist/css/bootstrap.min.css";
import {Button, ProgressBar} from "react-bootstrap";
import "./App.scss";
import {useState, useTransition} from "react";

function App() {
    console.log("popup start...");
    const [time, setTime] = useState();
    const [initialTime, setInitialTime] = useState(0);
    const [displayMode, setDisplayMode] = useState("stopped");
    const [isEditing, setIsEditing] = useState(false);
    const [toChangeTime, setToChangeTime] = useState(0);
    const [radioSelected, setRadioSelected] = useState(-1);
    chrome.storage.local.get(
        ["mode", "timePresets", "time", "timeSelected"],
        (res) => {
            console.log(
                "get Function fired, res =",
                JSON.stringify(res)
            );
            setDisplayMode(res.mode);
            setTime(res.time || 0);
            setInitialTime(res.timePresets.time);
            setRadioSelected(res.timeSelected);
        }
    );

    const radioOnClickListener = (t) => {
        console.log("radio clicked, t=", t);
        chrome.storage.local.set({"time": t});
    };

    chrome.storage.onChanged.addListener((changes, namespace) => {
        console.log(
            "onChange fired, changes=",
            JSON.stringify(changes)
        );
        if (changes.time) {
            if (changes.time.newValue == 0)
                // timer over
                chrome.alarms.clear("alarm", () => {
                    chrome.storage.local.set({
                        "mode": "stopped",
                        "time": initialTime,
                    });
                });
            setTime(changes.time.newValue);
        }
        // if (changes.mode) {
        //     setDisplayMode(changes.mode.newValue);
        // }
    });

    const start = () => {
        console.log("start Clicked.");
        chrome.alarms.create(
            "alarm",
            {
                periodInMinutes: 1 / 60,
            },
            () => {
                setDisplayMode("started");
                chrome.storage.local.set({
                    "mode": "started",
                    "time": initialTime,
                });
            }
        );
    };

    const stop = () => {
        console.log("stop Clicked.");
        chrome.alarms.clear("alarm", () => {
            chrome.storage.local.set({
                "mode": "stopped",
                "time": initialTime,
            });
        });
    };

    const editClickHandler = () => {
        setIsEditing(true);
    };

    const doneClickHandler = () => {
        setIsEditing(false);
        if (toChangeTime >= 0 && toChangeTime < 200 * 60) {
            chrome.storage.local.set({
                "time": toChangeTime,
                "timePresets": {"time": toChangeTime},
            });
        }
    };

    const inputOnChangeListener = (value) => {
        setToChangeTime(value * 60);
    };

    const cancelClickHandler = () => {
        setIsEditing(false);
    };

    return (
        <div className="App">
            <p className="text-center timerHeading">Timer</p>
            {displayMode != "started" ? (
                <>
                    <div>
                        <input
                            className="radioBtn"
                            type="radio"
                            id="idTime1"
                            name="timeGroup"
                            checked={radioSelected == 1}
                            onClick={() =>
                                radioOnClickListener(initialTime)
                            }
                        />
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
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={doneClickHandler}
                            >
                                Done
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                onClick={cancelClickHandler}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-sm btn-success me-2"
                                onClick={start}
                                disabled={!time}
                            >
                                Start
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={editClickHandler}
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <button
                        type="button"
                        className="btn btn-sm btn-warning ms-2"
                        onClick={stop}
                    >
                        stop
                    </button>
                    <ProgressBar
                        striped
                        now={((time / initialTime) * 100).toFixed(2)}
                    />
                </>
            )}
            <p className="mt-2 mb-0">time: {time}</p>
            <p className="mb-0">initialTime: {initialTime}</p>
            <p className="mb-0">displayMode: {displayMode}</p>
            <p className="mb-0">isEditing: {isEditing}</p>
            <p className="mb-0">toChangeTime: {toChangeTime}</p>
            <p className="mb-0">
                ProgressBar percentage:{" "}
                {((time / initialTime) * 100).toFixed(2)}
            </p>
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

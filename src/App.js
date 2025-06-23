/*global chrome*/
/*global local*/

import {
    faCheck,
    faCheckSquare,
    // faCircle,
    faClock,
    faDeleteLeft,
    faExclamationCircle,
    faLeaf,
    faMoon,
    faPlus,
    // faSquare,
    faSun,
    faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";
import {faSquare, faTrashAlt} from "@fortawesome/free-regular-svg-icons";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {Button, Col, Dropdown, FormCheck, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import "./App.scss";
import "./custom.scss";
// import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons/faSquareCaretDown";
const MODES = ["light", "dark"];
function App() {
    const [tasks, setTasks] = useState([]);
    const [curPriority, setCurPriority] = useState(0);
    const [filterPriority, setFilterPriority] = useState(-1); // -1: all, 0: lo, 1: med, 2: hi
    const [mode, setMode] = useState(0);
    useEffect(() => {
        // chrome.storage.sync.get(["tasks", "mode"], (res) => {
        //     setTasks(res.tasks || []);
        //     setMode(res.mode || 0);
        // });
    }, []);

    const handleAddTask = () => {
        const textarea = document.querySelector("textarea");
        const value = textarea.value.trim();
        if (!value) return;
        textarea.value = "";
        textarea.focus();
        const newTask = {task: value, uuid: uuidv4(), priority: curPriority, isCompleted: false};
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        setFilterPriority(-1);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    // const handleReorder = (newTasksList) => {
    //     setTasks(newTasksList);
    //     // chrome.storage.sync.set({tasks: newTasksList});
    // };

    const onDelete = (uuid) => {
        const updatedTasks = tasks.filter((item) => item.uuid !== uuid);
        setTasks(updatedTasks);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    const updateTaskPriority = (uuid, newPriority) => {
        const updatedTasks = tasks.map((task) => {
            if (task.uuid === uuid) {
                return {...task, priority: newPriority};
            }
            return task;
        });
        setTasks(updatedTasks);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };
    const updateTaskDone = (uuid, isDone) => {
        const updatedTasks = tasks.map((task) => {
            if (task.uuid === uuid) {
                return {...task, isCompleted: isDone};
            }
            return task;
        });
        setTasks(updatedTasks);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    const handleClickTheme = () => {
        setMode((mode + 1) % 2);
        // chrome.storage.sync.set({mode: (mode + 1) % 2});
    };

    const onClickFilterBtn = (filterVal) => {
        setFilterPriority(filterVal);
    };

    return (
        <div className={`App p-2 pe-0 pb-0 ${MODES[mode]}`} style={{width: 450}}>
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={12} className="ps-1 headerCol">
                    <h5 className="text-center">My Todo List ✏️</h5>
                    <FontAwesomeIcon
                        className="pointer modeIcon"
                        icon={mode ? faSun : faMoon}
                        onClick={handleClickTheme}
                    />
                </Col>
            </Row>
            <Row className="pe-2 mb-1 buttons-section ">
                <Col xs={12}>
                    <textarea type="text" className="p-2" placeholder="Start typing" />
                </Col>
                <Col
                    xs={{
                        span: 6,
                        offset: 0,
                    }}
                    className="pe-1 ps-3 d-flex align-items-start"
                >
                    <span className="me-1 fontSmall filterText">Filter by:</span>
                    <Button
                        variant="link"
                        style={{
                            border: filterPriority == 0 ? "2px solid #34C759BB" : "",
                            background: "#34C75915",
                            width: 25,
                        }}
                        size="sm"
                        className="p-0 ms-0"
                        onClick={() => onClickFilterBtn(0)}
                    >
                        <FontAwesomeIcon icon={faLeaf} style={{color: "#34C759"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{
                            border: filterPriority == 1 ? "2px solid #FF9500BB" : "",
                            background: "#FF950015",
                            width: 25,
                        }}
                        size="sm"
                        className="p-0 ms-1"
                        onClick={() => onClickFilterBtn(1)}
                    >
                        <FontAwesomeIcon icon={faClock} style={{color: "#FF9500"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{
                            border: filterPriority == 2 ? "2px solid #FF3B30BB" : "",
                            background: "#FF3B3015",
                            width: 25,
                        }}
                        size="sm"
                        className="p-0 ms-1"
                        onClick={() => onClickFilterBtn(2)}
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} style={{color: "#FF3B30"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{
                            border: filterPriority == -1 ? "2px solid #0B5ED7BB" : "",
                            background: "#0B5ED715",
                            width: 25,
                            color: "black",
                        }}
                        size="sm"
                        className="p-0 ms-1 fontSmall"
                        onClick={() => onClickFilterBtn(-1)}
                    >
                        <FontAwesomeIcon icon={faList} style={{color: "#0B5ED7"}} />
                    </Button>
                </Col>
                <Col
                    xs={{
                        span: 3,
                        offset: 1,
                    }}
                    className="p-0"
                >
                    <Dropdown size="sm" onSelect={(priority) => setCurPriority(priority)}>
                        <Dropdown.Toggle
                            className="p-0 ms-1 dropdown-toggle"
                            variant={mode == 0 ? "outline-primary" : "dark-primary"}
                            id="dropdown-basic"
                            style={{
                                background:
                                    curPriority == 0
                                        ? "#34C75915"
                                        : curPriority == 1
                                        ? "#FF950015"
                                        : "#FF3B3015",
                                borderColor:
                                    curPriority == 0
                                        ? "#34C759"
                                        : curPriority == 1
                                        ? "#FF9500"
                                        : "#FF3B30",
                                color:
                                    curPriority == 0
                                        ? "#34C759"
                                        : curPriority == 1
                                        ? "#FF9500"
                                        : "#FF3B30",
                            }}
                        >
                            {curPriority == 0 ? (
                                <span>
                                    <FontAwesomeIcon className="pointer Icon" icon={faLeaf} />{" "}
                                    <b>Low priority</b>
                                </span>
                            ) : curPriority == 1 ? (
                                <>
                                    <FontAwesomeIcon className="pointer Icon" icon={faClock} />{" "}
                                    <b>Med priority</b>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon
                                        className="pointer Icon"
                                        icon={faExclamationCircle}
                                    />{" "}
                                    <b>High priority</b>
                                </>
                            )}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item className="py-0 fontSmall lowPriority" eventKey={0}>
                                <FontAwesomeIcon className="pointer Icon" icon={faLeaf} /> Low
                            </Dropdown.Item>
                            <Dropdown.Item className="py-0 fontSmall medPriority" eventKey={1}>
                                <FontAwesomeIcon className="pointer Icon" icon={faClock} /> Medium
                            </Dropdown.Item>
                            <Dropdown.Item className="py-0 fontSmall highPriority" eventKey={2}>
                                <FontAwesomeIcon
                                    className="pointer Icon"
                                    icon={faExclamationCircle}
                                />{" "}
                                High
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col
                    xs={{
                        span: 2,
                    }}
                >
                    <Button
                        variant={mode == 0 ? "primary" : "dark-primary"}
                        size="sm"
                        className="p-0"
                        onClick={handleAddTask}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-1 addBtn" />
                        Add
                    </Button>
                </Col>
            </Row>
            <Row className="tasksListRow mx-0 pb-4">
                {tasks.length ? (
                    tasks
                        .filter(
                            (task) =>
                                filterPriority === -1 || (task.priority ?? 0) == filterPriority
                        )
                        .map((task) => (
                            <TaskItem
                                key={task.uuid}
                                mode={mode}
                                task={task}
                                onDelete={onDelete}
                                updateTaskPriority={updateTaskPriority}
                                updateTaskDone={updateTaskDone}
                            />
                        ))
                ) : (
                    <span className="text-center fontSmall mt-1 mb-0 pt-4">
                        Write your tasks above
                    </span>
                )}
            </Row>
        </div>
    );
}

const TaskItem = ({mode: theme, task, onDelete, updateTaskPriority, updateTaskDone}) => {
    const toggleDone = () => {
        updateTaskDone(task.uuid, !task.isCompleted);
    };

    const displayedText = task.isCompleted
        ? task.task.substring(0, 30) + (task.task.length > 30 ? "..." : "")
        : task.task;

    return (
        <div className="my-1 mx-0 ps-0 pe-0 py-1 d-flex justify-content-between taskRow">
            <Col xs={8} className="ps-1 me-0 task d-flex align-items-start border-bottom">
                <FontAwesomeIcon
                    icon={task.isCompleted ? faCheckSquare : faSquare}
                    className="mt-1 mb-1 me-2 pointer"
                    style={{color: theme === 0 ? "#006c1a" : "#FFB0FF"}}
                    onClick={toggleDone}
                />
                <pre
                    className={
                        "mb-0 " +
                        (task.task.length <= 100
                            ? ""
                            : task.task.length <= 300
                            ? " fontSmall"
                            : " fontSmaller")
                    }
                    style={{
                        textDecoration: task.isCompleted ? "line-through" : "none",
                        color: task.isCompleted ? "#777" : "inherit",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    {displayedText}
                </pre>
            </Col>
            <Col xs={3} className="d-flex justify-content-end pe-1">
                <Button
                    variant="link"
                    style={{
                        outline:
                            (task.priority ?? 0) === 0
                                ? task.isCompleted
                                    ? "2px solid #A0A0A080"
                                    : "2px solid #34C75980"
                                : "",
                        width: 60,
                    }}
                    size="sm"
                    className="p-0"
                    onClick={() => updateTaskPriority(task.uuid, 0)}
                >
                    <FontAwesomeIcon
                        icon={faLeaf}
                        style={{
                            color: task.isCompleted ? "#A0A0A0" : "#34C759",
                        }}
                    />
                </Button>

                <Button
                    variant="link"
                    style={{
                        outline:
                            (task.priority ?? 0) === 1
                                ? task.isCompleted
                                    ? "2px solid #A0A0A080"
                                    : "2px solid #FF950080"
                                : "",
                        width: 60,
                    }}
                    size="sm"
                    className="p-0"
                    onClick={() => updateTaskPriority(task.uuid, 1)}
                >
                    <FontAwesomeIcon
                        icon={faClock}
                        style={{
                            color: task.isCompleted ? "#A0A0A0" : "#FF9500",
                        }}
                    />
                </Button>

                <Button
                    variant="link"
                    style={{
                        outline:
                            (task.priority ?? 0) === 2
                                ? task.isCompleted
                                    ? "2px solid #A0A0A080"
                                    : "2px solid #FF3B3080"
                                : "",
                        width: 60,
                    }}
                    size="sm"
                    className="p-0"
                    onClick={() => updateTaskPriority(task.uuid, 2)}
                >
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        style={{
                            color: task.isCompleted ? "#A0A0A0" : "#FF3B30",
                        }}
                    />
                </Button>

                <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-0 trash-can"
                    style={{
                        // backgroundColor:"#5a1a1a22",
                        width: 60,
                    }}
                    onClick={() => onDelete(task.uuid)}
                >
                    <FontAwesomeIcon icon={faTrashAlt} style={{color: "#800600", width: 15}} />
                </Button>
            </Col>
        </div>
    );
};

export default App;

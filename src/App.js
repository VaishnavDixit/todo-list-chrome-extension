/*global chrome*/
/*global local*/

import {
	faCheck,
	faClock,
	faExclamation,
	faLeaf,
	faMoon,
	faPlus,
	faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./App.scss";
import "./custom.scss";
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
        const newTask = {task: value, uuid: uuidv4(), priority: curPriority};
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        setFilterPriority(curPriority);
        setCurPriority(0);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    const tabs = [
        {id: "low", label: "low"},
        {id: "med", label: "med"},
        {id: "high", label: "high"},
    ];
    let [activeTab, setActiveTab] = useState(tabs[0].id);

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
        // chrome.storage.sync.set({ tasks: updatedTasks });
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
                    <span className="fontSmall me-1">Filter by:</span>
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
                        <FontAwesomeIcon icon={faExclamation} style={{color: "#FF3B30"}} />
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
                    // xs={{
                    //     span: 3,
                    //     offset: 6,
                    // }}
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
                                        className="pointer Icon mx-1"
                                        icon={faExclamation}
                                    />
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
                                    className="pointer Icon mx-1"
                                    icon={faExclamation}
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
            <Row className="tasksListRow mx-0">
                {tasks.length ? (
                    tasks
                        .filter((task) => filterPriority === -1 || (task.priority ?? 0) == filterPriority)
                        .map((task) => (
                            <TaskItem
                                key={task.uuid}
                                mode={mode}
                                task={task}
                                onDelete={onDelete}
                                updateTaskPriority={updateTaskPriority}
                            />
                        ))
                ) : (
                    <span className="text-center fontSmall mt-1 mb-0 py-3">Write your tasks above</span>
                )}
            </Row>
        </div>
    );
}

const TaskItem = ({mode: theme, task, onDelete, updateTaskPriority}) => (
    <div className="my-1 mx-0 ps-0 pe-0 d-flex justify-content-between taskRow">
        <Col xs={8} className="ps-1 me-0 task d-flex align-items-start border-bottom">
            <pre
                className={
                    "mb-0 " +
                    (task.task.length <= 100
                        ? ""
                        : task.task.length <= 300
                        ? " fontSmall"
                        : " fontSmaller")
                }
            >
                {task.task}
            </pre>
        </Col>
        <Col xs={3} className="d-flex justify-content-end">
            <Button
                variant="link"
                style={{outline: (task.priority ?? 0) == 0 ? "2px solid #34C75980" : "", width: 60}}
                size="sm"
                className="p-0 "
                onClick={() => updateTaskPriority(task.uuid, 0)}
            >
                <FontAwesomeIcon icon={faLeaf} style={{color: "#34C759"}} />
            </Button>
            <Button
                variant="link"
                style={{outline: (task.priority ?? 0) == 1 ? "2px solid #FF950080" : "", width: 60}}
                size="sm"
                className="p-0 "
                onClick={() => updateTaskPriority(task.uuid, 1)}
            >
                <FontAwesomeIcon icon={faClock} style={{color: "#FF9500"}} />
            </Button>
            <Button
                variant="link"
                style={{outline: (task.priority ?? 0) == 2 ? "2px solid #FF3B3080" : "", width: 60}}
                size="sm"
                className="p-0 "
                onClick={() => updateTaskPriority(task.uuid, 2)}
            >
                <FontAwesomeIcon icon={faExclamation} style={{color: "#FF3B30"}} />
            </Button>
            <Button
                variant="link"
                size="sm"
                className="p-0 ms-1"
                onClick={() => onDelete(task.uuid)}
            >
                <FontAwesomeIcon icon={faCheck} style={{color: "#1baa3f"}} />
            </Button>
        </Col>
    </div>
);

export default App;

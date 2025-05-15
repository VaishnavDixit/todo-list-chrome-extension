/*global chrome*/
/*global local*/

import {
    faCheck,
    faLeaf,
    faLocationPin,
    faClock,
    faFireAlt,
    faGripVertical,
    faMoon,
    faPlus,
    faSun,
    faExclamationTriangle,
    faExclamation,
    faCircle,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {Reorder, motion} from "framer-motion";
import {useEffect, useState} from "react";
import {Button, Col, Dropdown, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import "./App.scss";
import "./custom.scss";
const MODES = ["light", "dark"];
function App() {
    const [tasks, setTasks] = useState([]);
    const [curPriority, setCurPriority] = useState(0);
    const [filterPriority, setFilterPriority] = useState(0);
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

    const handleClickTheme = () => {
        setMode((mode + 1) % 2);
        // chrome.storage.sync.set({mode: (mode + 1) % 2});
    };

    return (
        <div className={`App p-2 pe-0 pb-0 ${MODES[mode]}`} style={{width: 500}}>
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
                <Col xs={12} sm={12}>
                    <textarea type="text" className="p-2" placeholder="Start typing" />
                </Col>
                <Col
                    sm={{
                        span: 6,
                        offset: 0,
                    }}
                    className="pe-1 ps-3 d-flex align-items-center"
                >
                    <span className="fontSmall me-1">Filter by:</span>
                    <Button
                        variant="link"
                        style={{background: "#34C75915", width: 25}}
                        size="sm"
                        className="p-0 ms-0"
                        onClick={handleAddTask}
                    >
                        <FontAwesomeIcon icon={faLeaf} style={{color: "#34C759"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{background: "#FF950015", width: 25}}
                        size="sm"
                        className="p-0 ms-1"
                        onClick={handleAddTask}
                    >
                        <FontAwesomeIcon icon={faClock} style={{color: "#FF9500"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{background: "#FF3B3015", width: 25}}
                        size="sm"
                        className="p-0 ms-1"
                        onClick={handleAddTask}
                    >
                        <FontAwesomeIcon icon={faExclamation} style={{color: "#FF3B30"}} />
                    </Button>
                    <Button
                        variant="link"
                        style={{width: 55, color: "black"}}
                        size="sm"
                        className="p-0 ms-0 fontSmall"
                        onClick={handleAddTask}
                    >
                       show all
                    </Button>
                </Col>
                <Col
                    sm={{
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
                                // color: curPriority == 0 ? "black" : curPriority == 0 ? "black" : "white"
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
                    sm={{
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
                    tasks.map((task) => <TaskItem mode={mode} task={task} onDelete={onDelete} />)
                ) : (
                    <span className="text-center fontSmall mt-1 mb-0">Write your tasks above</span>
                )}
            </Row>
        </div>
    );
}

const TaskItem = ({mode: theme, task, onDelete}) => (
    <div className="py-1 mx-0 ps-0 pe-0 d-flex justify-content-between taskRow">
        <Col xs={8} className="ps-1 me-0 task d-flex align-items-start">
            <FontAwesomeIcon icon={faCircle} className="bulletIcon me-1 mt-2" />
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
        <Col sm={3} className="d-flex justify-content-end">
            <Button
                variant="link"
                style={{background: "#34C75915", width: 25}}
                size="sm"
                className="p-0 ms-1"
            >
                <FontAwesomeIcon icon={faLeaf} style={{color: "#34C759"}} />
            </Button>
            <Button
                variant="link"
                style={{background: "#FF950015", width: 25}}
                size="sm"
                className="p-0 ms-1"
            >
                <FontAwesomeIcon icon={faClock} style={{color: "#FF9500"}} />
            </Button>
            <Button
                variant="link"
                style={{background: "#FF3B3015", width: 25}}
                size="sm"
                className="p-0 ms-1"
            >
                <FontAwesomeIcon icon={faExclamation} style={{color: "#FF3B30"}} />
            </Button>
        </Col>
        <Col xs={1} className="d-flex align-items-center justify-content-end pe-2">
            <FontAwesomeIcon icon={faCheck} className="checkIcon" />
        </Col>
    </div>
);

export default App;

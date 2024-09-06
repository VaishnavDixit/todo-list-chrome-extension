/*global chrome*/
/*global local*/

import {faCheck, faGripVertical, faMoon, faPlus, faSun} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {Reorder} from "framer-motion";
import {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import "./App.scss";
import "./custom.scss";
const MODES = ["light", "dark"];
function App() {
    const [tasks, setTasks] = useState([]);
    const [mode, setMode] = useState(0);
    useEffect(() => {
        chrome.storage.sync.get(["tasks", "mode"], (res) => {
            setTasks(res.tasks || []);
            setMode(res.mode || 0);
        });
    }, []);

    const handleAddTask = () => {
        const textarea = document.querySelector("textarea");
        const value = textarea.value.trim();
        if (!value) return;
        textarea.value = "";
        textarea.focus();
        const newTask = {task: value, uuid: uuidv4()};
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        chrome.storage.sync.set({tasks: updatedTasks});
    };

    const handleReorder = (newTasksList) => {
        setTasks(newTasksList);
        chrome.storage.sync.set({tasks: newTasksList});
    };

    const handleDeleteTask = (uuid) => {
        const updatedTasks = tasks.filter((item) => item.uuid !== uuid);
        setTasks(updatedTasks);
        chrome.storage.sync.set({tasks: updatedTasks});
    };

    const handleClickTheme = () => {
        setMode((mode + 1) % 2);
        chrome.storage.sync.set({mode: (mode + 1) % 2});
    };

    return (
        <div className={"App p-2 pe-0 pb-0 " + MODES[mode]} style={{width: "350px"}}>
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={12} className="ps-1 headerCol">
                    {/* </div> */}
                    <h5 className="text-center">My Todo List ✏️</h5>
                    <FontAwesomeIcon
                        className="pointer modeIcon"
                        icon={mode ? faSun : faMoon}
                        onClick={handleClickTheme}
                    />
                </Col>
            </Row>
            <Row className="pe-2 mb-1">
                <Col xs={9} className="pe-0">
                    <textarea type="text" className="p-2" placeholder="Start typing" />
                </Col>
                <Col xs={3} className="d-flex justify-content-end">
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
                <Reorder.Group className="ps-0" axis="y" values={tasks} onReorder={handleReorder}>
                    {tasks.length ? (
                        tasks.map((task) => (
                            <TaskItem
                                mode={mode}
                                key={task.uuid}
                                task={task}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    ) : (
                        <p className="text-center fontSmall mt-1 mb-0">Write your tasks above</p>
                    )}
                </Reorder.Group>
            </Row>
        </div>
    );
}

const TaskItem = ({mode, task, onDelete}) => (
    <Reorder.Item
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            type: "spring",
            damping: 23,
            stiffness: 500,
        }}
        value={task}
    >
        <div className="py-1 mx-0 ps-0 pe-0 d-flex justify-content-between taskRow">
            <Col xs={10} className="ps-1 me-0 task d-flex align-items-center">
                <FontAwesomeIcon icon={faGripVertical} className="reorderIcon me-1" />
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
            <Col xs={2} className="d-flex align-items-start">
                <Button
                    size="sm"
                    className="p-0 m-0"
                    variant={mode == 0 ? "outline-success" : "dark-primary"}
                    onClick={() => onDelete(task.uuid)}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </Button>
            </Col>
        </div>
    </Reorder.Item>
);

export default App;

/*global chrome*/
/*global local*/

import {faCheck, faGripVertical, faPlus, faReorder} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {Reorder} from "framer-motion";
import {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import "./App.scss";
import "./custom.scss";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import {faGripLines} from "@fortawesome/free-solid-svg-icons/faGripLines";

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // chrome.storage.sync.get(["tasks"], (res) => {
        //     setTasks(res.tasks || []);
        // });
    }, []);

    const handleAddTask = () => {
        const textarea = document.querySelector("textarea");
        const value = textarea.value.trim();
        if (!value) return;
        textarea.value = "";
        const newTask = {task: value, uuid: uuidv4()};
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    const handleReorder = (newTasksList) => {
        setTasks(newTasksList);
        // chrome.storage.sync.set({tasks: newTasksList});
    };

    const handleDeleteTask = (uuid) => {
        const updatedTasks = tasks.filter((item) => item.uuid !== uuid);
        setTasks(updatedTasks);
        // chrome.storage.sync.set({tasks: updatedTasks});
    };

    return (
        <div className="App p-2 pe-0 pb-0" style={{width: "350px"}}>
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={12} className="ps-1">
                    <h5 className="text-center">My Todo List ✏️</h5>
                </Col>
            </Row>
            <Row className="pe-2 mb-1">
                <Col xs={9} className="pe-0">
                    <textarea type="text" className="form-control" placeholder="Start typing" />
                </Col>
                <Col xs={3} className="d-flex justify-content-end">
                    <Button variant="primary" size="sm" onClick={handleAddTask}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Add
                    </Button>
                </Col>
            </Row>
            <Row className="tasksListRow mx-0">
                <Reorder.Group className="ps-0" axis="y" values={tasks} onReorder={handleReorder}>
                    {tasks.length ? (
                        tasks.map((task) => (
                            <TaskItem key={task.uuid} task={task} onDelete={handleDeleteTask} />
                        ))
                    ) : (
                        <p className="text-center fontSmall">Write your tasks above</p>
                    )}
                </Reorder.Group>
            </Row>
        </div>
    );
}

const TaskItem = ({task, onDelete}) => (
    <Reorder.Item
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{
            type: "spring",
            damping: 15,
            stiffness: 500,
        }}
        value={task}
        style={{background: "white"}}
    >
        <div className="py-1 mx-0 ps-0 pe-1 d-flex justify-content-between taskRow">
            <Col xs={10} className="px-1 task d-flex align-items-center">
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
                    variant="outline-success"
                    onClick={() => onDelete(task.uuid)}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </Button>
            </Col>
        </div>
    </Reorder.Item>
);

export default App;

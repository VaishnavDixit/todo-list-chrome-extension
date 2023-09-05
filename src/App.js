/*global chrome*/
/*global local*/

import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import "./App.scss";
import {Button, Col, Row} from "react-bootstrap";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
function App() {
    const {v4: uuidv4} = require("uuid");
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        chrome.storage.local.get(["tasks"], (res) => {
            setTasks(res.tasks || []);
        });
    }, []);

    const addClickHandler = () => {
        const value = document
            .getElementsByTagName("input")[0]
            .value.trim();
        if (!value) return;
        document.getElementsByTagName("input")[0].value = "";
        const newUuid = uuidv4();
        setTasks([...tasks, {task: value, uuid: newUuid}]);
        chrome.storage.local.set({
            tasks: [...tasks, {task: value, uuid: newUuid}],
        });
    };

    const deleteClickHandler = (uuid) => {
        setTasks((prev) => [
            ...prev.filter((item) => item.uuid !== uuid),
        ]);
        chrome.storage.local.set({
            tasks: [...tasks.filter((item) => item.uuid !== uuid)],
        });
    };

    return (
        <div className="App p-2" style={{width: "350px"}}>
            <Row className="mb-2">
                <Col xs={12}>
                    <h4 className="text-center">My Todo list</h4>
                </Col>
                <Col xs={9} className="pe-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Start typing..."
                    ></input>
                </Col>
                <Col xs={3}>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={addClickHandler}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="me-1"
                        />
                        Add
                    </Button>
                </Col>
            </Row>
            <Row className="tasksListRow">
                {tasks.length ? (
                    tasks?.map((val) => (
                        <Row className=" py-1 d-flex justify-content-between taskRow">
                            <Col xs={10}>{val.task}</Col>
                            <Col xs={2}>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() =>
                                        deleteClickHandler(val.uuid)
                                    }
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    ))
                ) : (
                    <p className="text-center mb-0">
                        Write your tasks above...
                    </p>
                )}
            </Row>
        </div>
    );
}

export default App;

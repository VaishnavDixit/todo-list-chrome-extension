/*global chrome*/
/*global local*/

import {
	faCheck,
	faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import "./App.scss";
function App() {
    const {v4: uuidv4} = require("uuid");
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        chrome.storage.sync.get(["tasks"], (res) => {
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
        chrome.storage.sync.set({
            tasks: [...tasks, {task: value, uuid: newUuid}],
        });
    };

    const deleteClickHandler = (uuid) => {
        setTasks((prev) => [
            ...prev.filter((item) => item.uuid !== uuid),
        ]);
        chrome.storage.sync.set({
            tasks: [...tasks.filter((item) => item.uuid !== uuid)],
        });
    };

    return (
        <div className="App p-2 pe-0 pb-0" style={{width: "350px"}}>
            <Row className="mb-1">
                <Col xs={12}>
                    <h4 className="text-center">My Todo list</h4>
                </Col>
            </Row>
            <Row className="pe-2 mb-1">
                <Col xs={9} className="pe-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Start typing..."
                    ></input>
                </Col>
                <Col xs={3} className="d-flex justify-content-end">
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
            <Row className="tasksListRow mx-0">
                {tasks.length ? (
                    tasks?.map((val) => (
                        <div className="py-1 mx-0 px-0 pe-1 d-flex justify-content-between taskRow">
                            <Col xs={10} className="px-0 ps-1">
                                {val.task}
                            </Col>
                            <Col xs={2}>
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() =>
                                        deleteClickHandler(val.uuid)
                                    }
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </Col>
                        </div>
                    ))
                ) : (
                    <p className="text-center">
                        Write your tasks above...
                    </p>
                )}
            </Row>
        </div>
    );
}

export default App;

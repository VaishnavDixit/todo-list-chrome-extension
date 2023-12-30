/*global chrome*/
/*global local*/

import {
    faCheck,
    faChevronRight,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import "./App.scss";
function App() {
    const {v4: uuidv4} = require("uuid");
    const [tasks, setTasks] = useState([]);
	const list = new Map();
	list["1"]=["11","12","13"];
	list["2"]=["21","22","23","24"];
	list["3"]=["31","33"];
	list["12"]=["121","122"];

	useEffect(() => {
        // chrome.storage.sync.get(
        //     ["tasks"],
        //     (res) => {
        //         setTasks(res.tasks || []);
        //     }
        // );
    }, []);

    const addClickHandler = () => {
        const value = document
            .getElementsByTagName("input")[0]
            .value.trim();
        if (!value) return;
        document.getElementsByTagName(
            "input"
        )[0].value = "";
        const newUuid = uuidv4();
        const newTasksList = [
            {task: value, uuid: newUuid},
            ...tasks,
        ];
        setTasks(newTasksList);
        // chrome.storage.sync.set({
        //     tasks: newTasksList,
        // });
    };

    const deleteClickHandler = (uuid) => {
        const temp = [
            ...tasks.filter(
                (item) => item.uuid !== uuid
            ),
        ];
        setTasks(temp);
        // chrome.storage.sync.set({
        //     tasks: temp,
        // });
    };

    return (
        <div
            className="App p-2 pe-0 pb-0"
            style={{width: "600px"}}
        >
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={6} className="ps-1">
                    <h4 className="text-start">
                        My Todo list
                    </h4>
                </Col>
            </Row>
            <Row className="pe-2 mb-1">
                <Col xs={8} className="pe-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Start typing..."
                    ></input>
                </Col>
                <Col
                    xs={3}
                    className="d-flex justify-content-end"
                >
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
                <Col
                    xs={1}
                    className="pe-0 d-flex align-items-center justify-content-center"
                >
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className="me-1"
                    />
                </Col>
                <Col
                    xs={11}
                    className="px-0 ps-1 task"
                >
                    <textarea
                        type="text"
                        id="fname"
						rows={1}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default App;

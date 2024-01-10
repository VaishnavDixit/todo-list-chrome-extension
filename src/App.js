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
import {
    Button,
    Col,
    NavItem,
    Row,
} from "react-bootstrap";
import "./App.scss";
import Index from "./components/task/Index";
function App() {
    const {v4: uuidv4} = require("uuid");
    const [tree, setTree] = useState({
        "start": [],
    });
    const [textIn, setTextIn] = useState({});
    // const list = new Map();
    // list["1"]=["11","12","13"];
    // list["2"]=["21","22","23","24"];
    // list["3"]=["31","33"];
    // list["12"]=["121","122"];

    useEffect(() => {
        // chrome.storage.sync.get(
        //     ["tasks"],
        //     (res) => {
        //         setTasks(res.tasks || []);
        //     }
        // );
    }, []);

    const addClickHandler = (
        parentUuid,
        text
    ) => {
        // const text = document
        //     .getElementsByTagName("input")[0]
        //     .value.trim();

        if (!text) return;
        // document.getElementsByTagName(
        //     "input"
        // )[0].value = "";

        const newUuid = uuidv4();
        const newTreeTemp = tree;
        const textInTemp = textIn;
        textInTemp[newUuid] = text;
        newTreeTemp[parentUuid].push(newUuid);
        newTreeTemp[newUuid] = [];
        setTextIn(textInTemp);
        setTree({...newTreeTemp});
        // chrome.storage.sync.set({
        //     tasks: newTasksList,
        // });
    };

    const deleteClickHandler = (uuid) => {
        const temp = [
            ...tree.filter(
                (item) => item.uuid !== uuid
            ),
        ];
        setTree(temp);
        // chrome.storage.sync.set({
        //     tasks: temp,
        // });
    };

    return (
        <div
            className="App p-2 pe-0 pb-0"
            style={{width: "1400px"}}
        >
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={6} className="ps-1">
                    <h4 className="text-start">
                        My Todo list
                    </h4>
                </Col>
            </Row>
            {/* <Row className="pe-2 mb-1">
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
                        onClick={(e) =>
                            addClickHandler(
                                "start",
                                document
                                    .getElementsByTagName(
                                        "input"
                                    )[0]
                                    .value.trim()
                            )
                        }
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="me-1"
                        />
                        Add
                    </Button>
                </Col>
            </Row> */}
            <Row className="tasksListRow mx-0 border">
                {" "}
                <div className="ps-1">
                    {tree["start"] &&
                        tree["start"].map(
                            (uuid) => (
                                <>
                                    <br />

                                    <Index
                                        uuid={
                                            uuid
                                        }
                                        tree={
                                            tree
                                        }
                                        textIn={
                                            textIn
                                        }
                                        addClickHandler={(
                                            uuid,
                                            text
                                        ) =>
                                            addClickHandler(
                                                uuid,
                                                text
                                            )
                                        }
                                    />
                                </>
                            )
                        )}
                    <Row className="pe-2 mb-1">
                        <Col
                            xs={8}
                            className="pe-0"
                        >
                            <input
                                type="text"
                                id="start"
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
                                onClick={(e) =>
                                    addClickHandler(
                                        "start",
                                        document
                                            .getElementById(
                                                "start"
                                            )
                                            .value.trim()
                                    )
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="me-1"
                                />
                                Add out
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Row>
            <pre>
                tree:{" "}
                {JSON.stringify(tree, null, 4)}
                <br />
                textIn:{" "}
                {JSON.stringify(textIn, null, 4)}
            </pre>
        </div>
    );
}

export default App;

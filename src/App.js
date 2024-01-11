/*global chrome*/
/*global local*/

import {faCheck, faChevronRight, faCircle, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect, useState} from "react";
import {Button, Col, NavItem, Row} from "react-bootstrap";
import "./App.scss";
import Index from "./components/task/Index";
function App() {
    const {v4: uuidv4} = require("uuid");
    const [tree, setTree] = useState({
        "start": [],
    });
    const [textIn, setTextIn] = useState({"start": "home"});
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

    const handlePressEnter = (parentUuid, text) => {
        if (!text) return;
        const newUuid = uuidv4();
        const newTreeTemp = tree;
        const textInTemp = textIn;
        textInTemp[newUuid] = text;
        newTreeTemp[parentUuid].push(newUuid);
        newTreeTemp[newUuid] = [];
        setTextIn(textInTemp);
        setTree({...newTreeTemp});
        document.getElementById(parentUuid).blur();
    };

    const handleTextChange = (uuid, newText) => {
        console.log(uuid, newText)
		setTextIn((prev) => {
            prev[uuid] = newText;
			console.log(prev);
            return prev;
        });
    };
    const deleteClickHandler = (uuid) => {
        const temp = [...tree.filter((item) => item.uuid !== uuid)];
        setTree(temp);
    };

    return (
        <div className="App p-2 pe-0 pb-0" style={{width: "1400px"}}>
            <Row className="mb-1 d-flex justify-content-between px-2">
                <Col xs={6} className="ps-1">
                    <h4 className="text-start">My Todo list</h4>
                </Col>
            </Row>
            <Row className="tasksListRow mx-0">
                <Index
                    uuid={"start"}
                    tree={tree}
                    handlePressEnter={(uuid, text) => handlePressEnter(uuid, text)}
                    handleTextChange={(uuid, newText) => handleTextChange(uuid, newText)}
                    textIn={textIn}
                />
            </Row>
            <pre>
                tree: {JSON.stringify(tree, null, 4)}
                <br />
                textIn: {JSON.stringify(textIn, null, 4)}
            </pre>
        </div>
    );
}

export default App;

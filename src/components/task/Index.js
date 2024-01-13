import {
    faArrowDown,
    faChevronCircleUp,
    faChevronDown,
    faChevronRight,
    faChevronUp,
    faCircle,
    faCircleChevronRight,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import "./style.scss";
import {Button, Col, Row} from "react-bootstrap";

const Index = ({uuid, tree, handlePressEnter, handleTextChange, textIn}) => {
    const [expand, setExpand] = useState(false);
    const [inputMode, setInputMode] = useState(false);
    const handlePlusIconClick = () => {
        handlePressEnter(uuid, "");
        // e.target.value = "";
        // setExpand(true);
        setInputMode(true);
    };
    useEffect(() => {
        if (inputMode) document.getElementById(uuid).focus();
    }, [inputMode]);

    return (
        <div
            className={`m-1 p-0 task ${tree[uuid] && tree[uuid].length ? "verticalLine" : ""} ${
                uuid == "start" ? "" : "horizontalLine"
            }`}
        >
            <div className="d-flex align-items-center">
                <FontAwesomeIcon
                    className="expandCollapseArrow"
                    icon={expand ? faChevronDown : faChevronRight}
                    onClick={() => setExpand(!expand)}
                />
                <textarea
                    rows={1}
                    type="text"
                    // id={uuid}
                    defaultValue={textIn[uuid] ?? ""}
                    placeholder="Start typing..."
                    // onKeyDown={(e) => {
                    //     console.log(e);
                    //     if (e.key == "Enter") {
                    //         handlePressEnter(uuid, e.target.value.trim());
                    //     }
                    // }}
                    onChange={(e) => {
                        handleTextChange(uuid, e.target.value.trim());
                    }}
                ></textarea>
            </div>
            {expand ? (
                <div className="ms-3 subTasksSection">
                    {tree[uuid] &&
                        tree[uuid].map((uuid2) => (
                            <Index
                                uuid={uuid2}
                                tree={tree}
                                textIn={textIn}
                                handlePressEnter={handlePressEnter}
                                handleTextChange={handleTextChange}
                            />
                        ))}
                </div>
            ) : (
                ""
            )}
            <Row className="mb-1">
                <Col xs={8} className="pe-0 ms-3 d-flex align-items-center newTaskInput">
                    {inputMode ? (
                        <>
                            {/* <FontAwesomeIcon
                                className="expandCollapseArrow"
                                icon={expand ? faChevronDown : faChevronRight}
                                onClick={() => setExpand(!expand)}
                            /> */}
                            <input
                                type="text"
                                id={uuid}
                                className="d-inline taskInput"
                                placeholder="Start typing..."
                                onKeyDown={(e) => {
                                    console.log(e);
                                    if (e.key == "Enter" && e.target.value.trim()) {
                                        handlePressEnter(uuid, e.target.value.trim());
                                        e.target.value = "";
                                        setExpand(true);
                                    }
                                }}
                            ></input>
                        </>
                    ) : (
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="plusIcon py-1"
                            onClick={handlePlusIconClick}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Index;

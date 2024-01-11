import {faCircle, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";

const Index = ({uuid, tree, handlePressEnter, handleTextChange, textIn}) => {
    return (
        <div className="m-1 p-0 border border-primary">
            <div className="d-flex align-items-center">
                <input
                    type="text"
                    id={uuid}
                    defaultValue={textIn[uuid] ?? ""}
                    placeholder="Start typing..."
                    // onKeyDown={(e) => {
                    //     console.log(e);
                    //     if (e.key == "Enter") {
                    //         handlePressEnter(uuid, e.target.value.trim());
                    //     }
                    // }}
                    onChange={(e) => handleTextChange(uuid, e.target.value.trim())}
                ></input>
            </div>
            <div className="ps-3 subTasksSection">
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
            <Row className="mb-1">
                <Col xs={8} className="pe-0 d-flex align-items-center">
                    <FontAwesomeIcon icon={faPlus} />
                    <input
                        type="text"
                        id={uuid}
                        className="d-inline"
                        placeholder="Start typing..."
                        onKeyDown={(e) => {
                            console.log(e);
                            if (e.key == "Enter") {
                                handlePressEnter(uuid, e.target.value.trim());
                                e.target.value = "";
                            }
                        }}
                    ></input>
                </Col>
            </Row>
        </div>
    );
};

export default Index;

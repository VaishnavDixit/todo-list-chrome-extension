import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";

const Index = ({
    uuid,
    tree,
    addClickHandler,
    textIn,
}) => {
    return (
        <div className="border border-primary m-1 p-1">
            <p>{textIn[uuid]}</p>
            <div className="ps-2">
                {tree[uuid] &&
                    tree[uuid].map((uuid2) => (
                        <>
                            {"val->"}
                            {textIn[uuid2]}
                            <br />

                            <Index
                                uuid={uuid2}
                                tree={tree}
                                textIn={textIn}
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
                    ))}
            </div>
            <Row className="pe-2 mb-1">
                <Col xs={8} className="pe-0">
                    <input
                        type="text"
                        id={uuid}
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
                        onClick={() =>
                            addClickHandler(
                                uuid,
                                document
                                    .getElementById(
                                        uuid
                                    )
                                    .value.trim()
                            )
                        }
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="me-1"
                        />
                        Add inside
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Index;

import React from "react";

const Index = ({task, tasks}) => {
    return (
        <div>
            <p>{task[1]}</p>
            {Object.entries(tasks).map(
                    (task) => (
                        <>
                            {task[1]}
                            <br />
                            <div className="ps-1">
                                <Index
                                    task={task}
                                    tasks={tasks}
                                />
                            </div>
                        </>
                    )
                )}
        </div>
    );
};

export default Index;

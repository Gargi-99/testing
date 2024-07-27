import React, { useEffect, useState } from 'react';
import "./Todo.css";
import TodoCards from './TodoCards';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Update from "./Update";
import axios from 'axios';

const Todo = () => {
    const [inputs, setInputs] = useState({ title: "", body: "", tag: "" });
    const [taskArray, setTaskArray] = useState([]);
    const [tags, setTags] = useState([]);
    const userId = sessionStorage.getItem("id");

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v2/tags');
            console.log('Tags fetched:', response.data.tags);
            setTags(response.data.tags || []);
        } catch (error) {
            console.error("Error fetching tags", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async () => {
        if (inputs.title === "" || inputs.body === "") {
            toast.error("Title or Body is Empty!");
        } else {
            if (userId) {
                try {
                    await axios.post("http://localhost:3000/api/v2/addTask", {
                        title: inputs.title,
                        body: inputs.body,
                        tags: [inputs.tag],  // Updated this to match your backend structure
                        userId
                    });
                    setInputs({ title: "", body: "", tag: "" });
                    toast.success("New Task Added!");
                    // Optionally, refresh the tasks list after adding a task
                    fetchTasks();
                } catch (error) {
                    console.error("Error adding task", error);
                    toast.error("Error adding task");
                }
            } else {
                toast.error("SignUp to add task!");
            }
        }
    };

    const handleDelete = async (taskId) => {
        if (userId) {
            try {
                await axios.delete(`http://localhost:3000/api/v2/deleteTask/${taskId}`, { data: { userId } });
                toast.success("Task Deleted!");
                setTaskArray(taskArray.filter(task => task._id !== taskId));
            } catch (error) {
                console.error("Error deleting task", error);
                toast.error("Error deleting task");
            }
        } else {
            toast.error("Please SignUp first");
        }
    };

    const handleUpdateDisplay = (value) => {
        document.getElementById("todo-update").style.display = value;
    };

    const handleUpdateTask = (value) => {
        // Your update logic
    };

    const fetchTasks = async () => {
        if (userId) {
            try {
                const response = await axios.get(`http://localhost:3000/api/v2/getTasks/${userId}`);
                setTaskArray(response.data.list || []);
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [userId]);

    return (
        <>
            <div className="todo">
                <ToastContainer />
                <div className="todo-main container d-flex justify-content-center align-items-center">
                    <div className='d-flex flex-column todo-inputs-div w-50 p-1 my-5'>
                        <input
                            type="text"
                            placeholder="TITLE"
                            className='my-2 p-2 todo-inputs'
                            onClick={() => document.getElementById("textarea").style.display = "block"}
                            name="title"
                            value={inputs.title}
                            onChange={handleInputChange}
                        />
                        <textarea
                            id='textarea'
                            type="text"
                            placeholder="BODY"
                            name="body"
                            className='p-2 todo-inputs'
                            value={inputs.body}
                            onChange={handleInputChange}
                        />
                        <select
                            name="tag"
                            className='my-2 p-2 todo-inputs'
                            value={inputs.tag}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Tag</option>
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <option key={tag._id} value={tag.name}>{tag.name}</option>
                                ))
                            ) : (
                                <option value="">No Tags Available</option>
                            )}
                        </select>
                        <button className='btn' onClick={handleSubmit}>Add</button>
                    </div>
                </div>
                <div className='todo-body'>
                    <div className="container-fluid">
                        <div className='row'>
                            {taskArray.map((item, index) => (
                                <div key={index} className='col-lg-3 col-8 mx-5 my-2'>
                                    <TodoCards
                                        title={item.title}
                                        body={item.body}
                                        id={item._id}
                                        delid={handleDelete}
                                        display={handleUpdateDisplay}
                                        updateId={index}
                                        toBeUpdate={handleUpdateTask}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='todo-update' id="todo-update">
                <div className="container" update>
                    <Update display={handleUpdateDisplay} update={taskArray} />
                </div>
            </div>
        </>
    );
};

export default Todo;

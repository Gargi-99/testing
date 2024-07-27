import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const Update = ({ display, update }) => {
    useEffect(() => {
        setInputs({
            title: update.title,
            body: update.body,
        })
    }, [update])

    const [Inputs, setInputs] = useState({
        title: "",
        body: "",
    });
    const change = (e) => {
        const { name, value } = e.target;
        setInputs({ ...Inputs, [name]: value });
    };
    const submit = async () => {
        await axios
            .put(`/api/v2/updateTask/${update._id}`, Inputs)
            .then((response) => {
                toast.success(response.data.message);
            });

        display("none");
    };

    return (
        <div className='p-5 d-flex justify-content-center align-items-start flex-column update'>
            <h3>Update Your Task</h3>
            <input className='todo-inputs my-4 w-100 p-3'
                type="text"
                value={Inputs.title}
                name="title"
                onChange={change}
            />
            <textarea className='todo-inputs w-100 p-3'
                value={Inputs.body}
                name="body"
                onChange={change}
            ></textarea>
            <div className='d-flex justify-content-center w-100'>
                <button className='btn my-3 mr-3' onClick={submit} >Update</button>
                <button className='btn my-3'
                    onClick={() => { display("none"); }}>
                    Cancel
                </button>
            </div>
        </div >
    )
}

export default Update;
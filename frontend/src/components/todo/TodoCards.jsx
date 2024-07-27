import { React, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";


const TodoCards = ({ title, body, id, delid, display, updateId, toBeUpdate }) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
    };
    return (
        <div className='p-3 todo-card'>
            <div>
                <div className='d-flex align-items-center'>
                    <input
                        type='checkbox'
                        className='todo-checkbox'
                        checked={checked}
                        onChange={handleCheckboxChange}
                    />
                    <h5 className={checked ? 'strikethrough' : ''}>{title}</h5>
                </div>
                <p className='todo-card-p'>
                    {body.split("", 77)}...
                </p>
            </div>
            <div className='d-flex justify-content-end'>
                <FaPen className='card-icons mx-2 px-2 py-1' onClick={() => {
                    display("block");
                    toBeUpdate(updateId);
                }} />
                <MdDelete className='card-icons del mx-2 px-2 py-1 '
                    onClick={() => {
                        delid(id);
                    }} />
            </div>
        </div>
    )
}

export default TodoCards;
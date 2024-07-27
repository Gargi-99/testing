import React from 'react'
import "./home.css";

const Home = () => {
    return (
        <div className="home d-flex justify-content-center align-items-center">
            <div className="container home d-flex justify-content-center align-items-center flex-column">
                <h1 className='text-center'>Organize your <br /> work and life, finally.</h1>
                <p className='text-center'>Become focused, organised, and target your goals with Scheduler.<br />
                    The best task manager app.</p>

                <button className='btn'>Join</button>
            </div>
        </div>
    )
}

export default Home
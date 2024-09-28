import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    function handleStart() {
        if (userName) {
            localStorage.setItem("userName", userName);
            navigate('/decks'); 
        }
    }

    return (
        <div className='home-page'>
            <h1>Welcome to Flash<span className='welcome-span'>Cardia!</span></h1>
            <div className='form-container'>
                <input 
                    type='text' 
                    placeholder='Enter your name to get started....' 
                    className='username'
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button className='start-button' onClick={handleStart}>Get Started</button>
            </div>
        </div>
    );
}

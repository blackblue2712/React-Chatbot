import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from '../MainRouter';
import Chatbot from './chatbot/Chatbot';


require('dotenv').config();

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <MainRouter></MainRouter>
                <Chatbot></Chatbot>
            </BrowserRouter>
        </div>
    )
}

export default App;
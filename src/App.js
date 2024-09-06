// src/App.js
import React from 'react';

import ChatBot from './ChatBot/ChatBot.js'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App"style={{ backgroundColor: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <header className="App-header">
        <h1>ChatBot</h1>
      </header>
      <ChatBot/>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { db, ref, set, get, remove } from '../firebase';

const responses = {
  'order status': 'Your order is being processed. Please wait.',
  'product info': 'We offer a wide variety of dishes. Check out our menu on our website.',
  'business hours': 'We are open from 9 AM to 9 PM every day.'
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showButtons, setShowButtons] = useState(true);

  // Fetch messages from Firebase
  const fetchMessages = async () => {
    try {
      const snapshot = await get(ref(db, 'messages'));
      if (snapshot.exists()) {
        const fetchedMessages = Object.values(snapshot.val());
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (userMessage) {
      const newMessages = [...messages, { type: 'user', text: userMessage }];
      const botResponse = responses[userMessage.toLowerCase()] || "Sorry, I didn't understand that.";
      newMessages.push({ type: 'bot', text: botResponse });

      setMessages(newMessages);
      setInput('');
      setShowButtons(false); // Hide buttons after user input

      // Save user and bot messages to Firebase
      try {
        await set(ref(db, 'messages/' + Date.now()), { type: 'user', text: userMessage });
        await set(ref(db, 'messages/' + Date.now() + '_bot'), { type: 'bot', text: botResponse });
      } catch (error) {
        console.error("Error adding messages: ", error);
      }
    }
  };

  const handleButtonClick = async (response) => {
    const newMessages = [...messages, { type: 'user', text: response }];
    const botResponse = responses[response.toLowerCase()] || "Sorry, I didn't understand that.";
    newMessages.push({ type: 'bot', text: botResponse });

    setMessages(newMessages);
    setShowButtons(false); // Hide buttons after selecting a button

    // Save user and bot messages to Firebase
    try {
      await set(ref(db, 'messages/' + Date.now()), { type: 'user', text: response });
      await set(ref(db, 'messages/' + Date.now() + '_bot'), { type: 'bot', text: botResponse });
    } catch (error) {
      console.error("Error adding messages: ", error);
    }
  };

  const handleClear = async () => {
    setMessages([]);
    setShowButtons(true); // Show buttons again after clearing

    // Clear messages from Firebase
    try {
      const snapshot = await get(ref(db, 'messages'));
      if (snapshot.exists()) {
        const messagesObj = snapshot.val();
        for (const key in messagesObj) {
          await remove(ref(db, 'messages/' + key));
        }
      }
    } catch (error) {
      console.error("Error clearing messages: ", error);
    }
  };

  return (
    <div className="chat-container" style={{ backgroundColor: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="message-bubbles">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      {showButtons ? (
        <div className="button-container">
          <Button variant="primary" onClick={() => handleButtonClick('order status')}>Order Status</Button>
          <Button variant="secondary" onClick={() => handleButtonClick('product info')}>Product Info</Button>
          <Button variant="success" onClick={() => handleButtonClick('business hours')}>Business Hours</Button>
        </div>
      ) : (
        <div className="clear-container">
          <Button variant="danger" onClick={handleClear}>Clear</Button>
        </div>
      )}
      <div className="input-container">
        <InputGroup>
          <FormControl
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!showButtons} // Disable input when buttons are not shown
          />
          <InputGroup.Text>
            <Button variant="primary" onClick={handleSend} disabled={!showButtons}>Send</Button>
          </InputGroup.Text>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatBot;

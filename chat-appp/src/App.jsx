import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, useRef } from 'react';
import UsernameForm from './components/user_registeration';
import './App.css';

// const supabaseUrl = process.env.supabaseUrl;
// const supabaseKey = process.env.superbaseKey;

const supabaseUrl = 'https://vdhraxzuflqyqtpvgepw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaHJheHp1ZmxxeXF0cHZnZXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4NjU3MzUsImV4cCI6MjAwOTQ0MTczNX0.W93fdlzLq2qhm3x2fca9lrxObk1XJcBhdw5DiGifuyM'; 


const supabase = createClient(supabaseUrl, supabaseKey)

function ChatApp(){
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const messagesListRef = useRef(null);


  useEffect(() => {
    fetchMessages();

    const subscription = supabase.channel('messages').on('INSERT', (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      }).subscribe();

    return () => {  
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchMessages() {
    const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .order('timestamp', { ascending: true });

          if (error) console.error('Error fetching messages:', error);
          else setMessages(messages);
  }


  async function sendMessage(e) {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    try {
      await supabase.from('messages').insert([
        { username: username, text: input.trim() },
      ]);
      fetchMessages();

      setInput('');

      if (messagesListRef.current) {
        console.log("messagesListRef.current:", messagesListRef.current);
        messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    
  }

  

  if(username === ''){
      return(<UsernameForm setUsername={setUsername} />)
  }

  else
  {
  return(
    <>
      <div className='chatapp'>
        <ul ref={messagesListRef}>
            {messages.map((message) => (
              <li key={message.id}><span>{message.username}</span>: {message.text}</li>
            ))}
        </ul>
        <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
        </form>
      </div>
    </>
    )
    }
    
}

export default ChatApp;

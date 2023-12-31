import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, useRef } from 'react';
import UsernameForm from './components/user_registeration';
import './App.css';

const supabaseUrl = import.meta.env.VITE_APP_supabaseUrl;
const supabaseKey = import.meta.env.VITE_APP_supabaseKey;


const supabase = createClient(supabaseUrl, supabaseKey)

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const bottomRef = useRef();


  useEffect(() => {
    fetchMessages();
    scrollToBottom();

    const subscription = supabase.channel('messages').on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      }).subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages])

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
      

      setInput('');

    } catch (error) {
      console.error('Error sending message:', error);
    }

  }

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };



  if (username === '') {
    return (<UsernameForm setUsername={setUsername} />)
  }

  else {
    return (
      <>
        <div className='chatapp'>
          <ul>
            {messages.map((message) => (
              <li key={message.id}><span>{message.username}</span>: {message.text}</li>
            ))}
            <div ref={bottomRef} className="list-bottom"></div>
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

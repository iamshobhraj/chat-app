import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import UsernameForm from './assets/user_registeration';
import './App.css';
const supabase = createClient('https://vdhraxzuflqyqtpvgepw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaHJheHp1ZmxxeXF0cHZnZXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4NjU3MzUsImV4cCI6MjAwOTQ0MTczNX0.W93fdlzLq2qhm3x2fca9lrxObk1XJcBhdw5DiGifuyM');

function ChatApp(){
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  async function fetchMessages() {
    const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .order('timestamp', { ascending: true });

          if (error) console.error('Error fetching messages:', error);
          else setMessages(messages);
  }

  useEffect(() => {
    // Fetch existing messages
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      // Unsubscribe when the component unmounts
      supabase.removeSubscription(subscription);
    };
  }, []);

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

  if(username!='')
  {
  return(
    <>
      <div className='chatapp'>
        <ul>
            {messages.map((message) => (
              <li key={message.id}>{message.text}</li>
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
    else
    {
      return(<UsernameForm setUsername={setUsername} />)
    }
}

export default ChatApp;

import React from 'react';
import { useForm } from 'react-hook-form';
import './styles/user_regis.css';

function UsernameForm({ setUsername }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    setUsername(data.username);
  };

  return (
    <form className="username-form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" {...register('username', { required: true })} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UsernameForm;

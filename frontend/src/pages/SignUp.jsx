import React, { useState } from 'react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const j = await res.json();
    if (j.ok) setMsg('Registered — you can sign in');
    else setMsg(j.error || 'error');
  }

  return (
    <div>
      <h3>Sign up</h3>
      <form onSubmit={submit}>
        <input placeholder='email' value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
        <button>Sign up</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}

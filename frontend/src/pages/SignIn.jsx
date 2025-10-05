import React, {useState} from 'react';

export default function SignIn({onLogin}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e){
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({email, password})
    });
    const j = await res.json();
    if(j.token){
      setMsg('Logged in');
      onLogin(j.token, password);
    } else setMsg(j.error||'error');
  }
  return <div><h3>Sign in</h3>
    <form onSubmit={submit}>
      <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Sign in</button>
    </form>
    <div>{msg}</div>
  </div>
}

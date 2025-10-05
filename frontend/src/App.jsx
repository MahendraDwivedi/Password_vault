import React, {useState} from 'react'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Vault from './pages/Vault'

export default function App(){
  const [token, setToken] = useState(window.sessionStorage.getItem('token') || null);
  const [password, setPassword] = useState(''); // user's password for deriving key (kept in memory only)
  if(!token){
    return <div className='container'>
      <h1>Password Vault (MVP)</h1>
      <SignIn onLogin={(t,p)=>{ setToken(t); setPassword(p); window.sessionStorage.setItem('token', t);}} />
      <hr />
      <SignUp />
    </div>
  }
  return <div className='container'>
    <button className='logout' onClick={()=>{ setToken(null); setPassword(''); window.sessionStorage.removeItem('token');}}>Logout</button>
    <Vault token={token} password={password} />
  </div>
}

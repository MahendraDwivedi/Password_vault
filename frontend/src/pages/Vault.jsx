import React, {useEffect, useState, useRef} from 'react';
import Generator from '../components/Generator';
import VaultList from '../components/VaultList';
import {deriveKey, encryptJSON, decryptJSON, generateSaltBase64} from '../lib/crypto';

export default function Vault({token, password}){
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const keyRef = useRef(null);

  useEffect(()=>{
    // derive master key from password + fixed user salt (we use per-item salt too)
    keyRef.current = null;
    (async ()=>{
      // no global salt — we'll derive per-item when encrypting. But create a master key for reuse by deriving from password+email (not stored)
      // For simplicity we'll keep the raw password in memory to derive per-item keys.
    })();
    fetchList();
  },[]);

  async function fetchList(){
    const res = await fetch('http://localhost:4000/api/vault', { headers: { Authorization: 'Bearer '+token } });
    const j = await res.json();
    setItems(j || []);
  }

  async function saveItem(plain){
    // plain: {title, username, password, url, notes}
    const salt = generateSaltBase64();
    const key = await deriveKey(password, salt);
    const enc = await encryptJSON(plain, key);
    const body = { title: plain.title || 'Encrypted', ciphertext: enc.ciphertext, iv: enc.iv, salt };
    const res = await fetch('http://localhost:4000/api/vault', {
      method:'POST', headers:{'content-type':'application/json', Authorization: 'Bearer '+token}, body: JSON.stringify(body)
    });
    await fetchList();
  }

  async function del(id){
    await fetch('http://localhost:4000/api/vault/'+id, { method:'DELETE', headers:{ Authorization: 'Bearer '+token } });
    await fetchList();
  }

  async function edit(id, plain){
    const salt = generateSaltBase64();
    const key = await deriveKey(password, salt);
    const enc = await encryptJSON(plain, key);
    await fetch('http://localhost:4000/api/vault/'+id, { method:'PUT', headers:{'content-type':'application/json', Authorization: 'Bearer '+token}, body: JSON.stringify({ title: plain.title||'Encrypted', ciphertext: enc.ciphertext, iv: enc.iv, salt }) });
    await fetchList();
  }

  async function reveal(item){
    try{
      const key = await deriveKey(password, item.salt);
      const plain = await decryptJSON(item.ciphertext, item.iv, key);
      alert('Decrypted: ' + JSON.stringify(plain));
    }catch(e){ alert('Decrypt failed'); }
  }

  const filtered = items.filter(i=> i.title && i.title.toLowerCase().includes(search.toLowerCase()));

  return <div>
    <h2>Vault</h2>
    <div className='row'>
      <input placeholder='Search by title' value={search} onChange={e=>setSearch(e.target.value)} />
    </div>
    
    <Generator onSave={saveItem} />
    <VaultList items={filtered} onDelete={del} onReveal={reveal} onEdit={edit} />
  </div>
}

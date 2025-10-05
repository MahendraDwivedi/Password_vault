import React, {useState, useEffect} from 'react';

const LOOK_ALIKE = ['i','l','1','I','0','O','o'];

function randInt(max){ return Math.floor(Math.random()*max); }

export default function Generator({onSave}){
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeLook, setExcludeLook] = useState(true);
  const [generated, setGenerated] = useState('');

  useEffect(()=> generate(), [length, useLower, useUpper, useNums, useSymbols, excludeLook]);

  function charset(){
    let s='';
    if(useLower) s += 'abcdefghijklmnopqrstuvwxyz';
    if(useUpper) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(useNums) s += '0123456789';
    if(useSymbols) s += '!@#$%^&*()-_=+[]{};:,.<>?';
    if(excludeLook) s = s.split('').filter(c=> !LOOK_ALIKE.includes(c)).join('');
    return s;
  }

  function generate(){
    const s = charset();
    if(!s) { setGenerated(''); return; }
    let out='';
    for(let i=0;i<length;i++) out += s[randInt(s.length)];
    setGenerated(out);
  }

  function copyThenClear(){
    navigator.clipboard.writeText(generated);
    setTimeout(()=>{ navigator.clipboard.writeText(''); }, 15000);
    alert('Copied — will clear in ~15s');
  }

  function save(){
    const title = prompt('Title for this entry') || 'Unnamed';
    const username = prompt('Username (optional)') || '';
    const url = prompt('URL (optional)') || '';
    const notes = prompt('Notes (optional)') || '';
    onSave({title, username, password: generated, url, notes});
    setGenerated('');
  }

  return <div className='generator'>
    <h4>Password generator</h4>
    <div className='row'>
      <label>Length: {length}</label>
      <input type='range' min='8' max='64' value={length} onChange={e=>setLength(Number(e.target.value))} />
    </div>
    <div className='row'>
      <label><input type='checkbox' checked={useLower} onChange={e=>setUseLower(e.target.checked)} /> lower</label>
      <label><input type='checkbox' checked={useUpper} onChange={e=>setUseUpper(e.target.checked)} /> upper</label>
      <label><input type='checkbox' checked={useNums} onChange={e=>setUseNums(e.target.checked)} /> numbers</label>
      <label><input type='checkbox' checked={useSymbols} onChange={e=>setUseSymbols(e.target.checked)} /> symbols</label>
      <label><input type='checkbox' checked={excludeLook} onChange={e=>setExcludeLook(e.target.checked)} /> exclude look-alikes</label>
    </div>
    <div><input readOnly value={generated} style={{width:'100%'}} /></div>
    <div className='row'>
      <button onClick={generate}>Regenerate</button>
      <button onClick={copyThenClear}>Copy (auto-clear)</button>
      <button onClick={save} disabled={!generated}>Save</button>
    </div>
  </div>
}

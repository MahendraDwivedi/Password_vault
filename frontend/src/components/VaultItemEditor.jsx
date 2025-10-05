import React from 'react';

export default function VaultItemEditor({item, onEdit}){
  async function edit(){
    const title = prompt('Title', item.title) || item.title;
    const username = prompt('Username', '') || '';
    const pwd = prompt('Password (will be re-encrypted)', '') || '';
    const url = prompt('URL', '') || '';
    const notes = prompt('Notes', '') || '';
    if(!pwd){ alert('No password entered, abort'); return; }
    onEdit(item._id, {title, username, password: pwd, url, notes});
  }
  return <button onClick={edit}>Edit</button>
}

import React from 'react';
import VaultItemEditor from './VaultItemEditor';

export default function VaultList({items, onDelete, onReveal, onEdit}){
  return <div className='vault-list'>
    <h4>Saved items</h4>
    {items.length===0 && <div>No items</div>}
    {items.map(it=> <div key={it._id} className='item'>
      <div><strong>{it.title}</strong></div>
      <div className='row'>
        <button onClick={()=>onReveal(it)}>Reveal</button>
        <button onClick={()=>onDelete(it._id)}>Delete</button>
        <VaultItemEditor item={it} onEdit={onEdit} />
      </div>
    </div>)}
  </div>
}

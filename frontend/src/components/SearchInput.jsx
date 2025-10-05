import React from 'react';
export default function SearchInput({value,onChange}){ return <input placeholder='Search' value={value} onChange={e=>onChange(e.target.value)} /> }

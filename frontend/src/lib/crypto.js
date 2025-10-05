// Client-side crypto helpers using Web Crypto.
const toBase64 = (buf)=> btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromBase64 = (b64)=> Uint8Array.from(atob(b64), c=>c.charCodeAt(0));

export function generateSaltBase64(){
  const s = window.crypto.getRandomValues(new Uint8Array(16));
  return toBase64(s);
}

export async function deriveKey(password, saltB64){
  const salt = fromBase64(saltB64);
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  const key = await window.crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:200000, hash:'SHA-256'}, baseKey, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
  return key;
}

export async function encryptJSON(obj, key){
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const pt = new TextEncoder().encode(JSON.stringify(obj));
  const ct = await window.crypto.subtle.encrypt({name:'AES-GCM', iv}, key, pt);
  return {ciphertext: toBase64(ct), iv: toBase64(iv)};
}

export async function decryptJSON(cipherB64, ivB64, key){
  const ct = fromBase64(cipherB64);
  const iv = fromBase64(ivB64);
  const pt = await window.crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}

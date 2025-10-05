const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const VaultItem = require('../models/VaultItem');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'no auth'});
  const parts = auth.split(' ');
  if(parts.length!==2) return res.status(401).json({error:'bad auth'});
  const token = parts[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){ return res.status(401).json({error:'invalid token'});}
}

router.use(authMiddleware);

// list
router.get('/', async (req,res)=>{
  const items = await VaultItem.find({userId: req.user.userId}).sort({createdAt:-1});
  res.json(items);
});

// create
router.post('/', async (req,res)=>{
  try{
    const {title, ciphertext, iv, salt} = req.body;
    if(!ciphertext || !iv || !salt) return res.status(400).json({error:'ciphertext required'});
    const item = await VaultItem.create({userId: req.user.userId, title, ciphertext, iv, salt});
    res.json(item);
  }catch(e){ console.error(e); res.status(500).json({error:'server'});}
});

router.delete('/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    await VaultItem.deleteOne({_id:id, userId: req.user.userId});
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'});}
});

router.put('/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const {title, ciphertext, iv, salt} = req.body;
    await VaultItem.updateOne({_id:id, userId: req.user.userId}, {$set:{title, ciphertext, iv, salt}});
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'});}
});

module.exports = router;

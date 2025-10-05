const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req,res)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({error:'email+password required'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'user exists'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({email, passwordHash: hash});
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({error:'server'});}
});

router.post('/login', async (req,res)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({error:'email+password required'});
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'invalid'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error:'invalid'});
    const token = jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, email: user.email});
  }catch(e){ console.error(e); res.status(500).json({error:'server'});}
});

module.exports = router;

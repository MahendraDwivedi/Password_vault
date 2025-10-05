require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const vaultRoutes = require('./src/routes/vault');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('Mongo connected'))
  .catch(err=> console.error('Mongo connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/', (req,res)=> res.send('Password Vault Backend'));

app.listen(PORT, ()=> console.log('Server listening on', PORT));

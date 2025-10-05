const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VaultSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  title: {type: String, default: ''},
  ciphertext: {type: String, required: true},
  iv: {type: String, required: true},
  salt: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('VaultItem', VaultSchema);

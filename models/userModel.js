let mongoose = require('mongoose');
let crypto = require('crypto');

let UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, required: [true, 'can\'t be blank'], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  hash: String,
  salt: String,
  token: String
}, {timestamps: true});


UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
 let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
 return this.hash === hash;
};

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;

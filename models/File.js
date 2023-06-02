const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalFilename: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;

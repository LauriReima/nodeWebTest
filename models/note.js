const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
// const url = `mongodb+srv://Lauri:salasana@wmdb.lvzr9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

module.exports = Note
const express = require("express");
const app = express();
const Note = require('./models/note')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// vähä corssii vähä
app.use(cors())
app.use(bodyParser.json())
app.use(logger)
app.use(express.static('build'))


// let notes = [
//   {
//     id: 1,
//     content: "HTML on helppoa",
//     date: "2017-12-10T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Selain pystyy suorittamaan vain javascriptiä",
//     date: "2017-12-10T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
//     date: "2017-12-10T19:20:14.298Z",
//     important: true,
//   },
// ];
const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id
  delete formattedNote.__v
  
  return formattedNote
}

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (req, res) => {
  Note
    .find({})
    .then(note => {
      res.json(note.map(formatNote))
  })
});

app.get("/api/notes/:id", (req, res) => {
  Note
    .findById(req.params.id)
    .then(note => {
      if (note){
        res.json(formatNote(note))
      }
      else {
        res.status(404).end
      }
    })
    .catch(err => {
      //console.log(err)
      res.status(404).send({error: 'malformatted id'})
    })
});

app.delete("/api/notes/:id", (req, res) => {
  // const id = Number(req.params.id);
  // notes = notes.filter((note) => note.id !== id);
  Note
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({error: 'malformated id'})
    })
  
});
app.put("/api/notes/:id", (req,res) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }
  Note
    .findByIdAndUpdate(req.params.id, note, {new: true})
    .then(updatedNote => {
      res.json(formatNote(updatedNote))
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({error: 'malformatted id'})
    })
})

const generateId = () => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 0
  return maxId + 1
}

app.post("/api/notes/", (req, res) => {
  const body = req.body

  if (body.content === undefined) {
    return res.status(400).json({error: 'content missing'})
  }
  const note = new Note ({
    content: body.content,
    date: new Date(),
    important: body.important || false   
  })
  note
    .save()
    .then(savedNote => {
      res.json(formatNote(savedNote))
  })   
})



// const app = http.createServer((req,res) => {
//     res.writeHead(200, { 'Content-Type': 'application/json' })
//     res.end(JSON.stringify(notes))
// })
const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(error)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

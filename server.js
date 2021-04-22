const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware function to serve css
app.use(express.static('public'));

// read (get) '' and join to display index.html at localhost:3000/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// read (get) /notes and join to display notes.html at localhost:3000/notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    const notes = require('./db/db.json');
    res.json(notes)
})

// add new notes to db.json with post method
app.post('/api/notes', (req, res) => {
    // set required db.json file to variable
    const db = require('./db/db.json')
    const newNote = req.body;
    // give each new note an id
    newNote.id = db.length;
    // add new notes to db
    db.push(newNote);
    // put new updated array to db.json
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) throw err;
    })
    return res.json(newNote)
})

// delete saved notes with delete method
app.delete('/api/notes/:id', (req, res) => {
    const db = require('./db/db.json');
    // filter through db and return new array
    const newNoteArr = db.filter(item => {
        return JSON.parse(req.params.id) !== item.id
    })
    // put new updated array to db.json
    fs.writeFile('./db/db.json', JSON.stringify(newNoteArr), (err) => {
        if (err) throw err;
        return res.json(req.params.id)
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})
const http = require('http');
// const fs = require('fs');
const path = require('path');
const express = require('express');
const fs = require("fs")
const util = require("util")
const readFilePromise = util.promisify(fs.readFile)
/**
 *   readFile - reads db.json
 * @returns a parsed array of character objects
 */
const readFile = async () => {
  let data = await readFilePromise("./db/db.json", "utf8")
  return JSON.parse(data)
}
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

app.get('/api/notes', async(req, res) => {
    // const notes = require('./db/db.json');
    const notes = await readFile();
    res.json(notes)
})

// add new notes to db.json with post method
app.post('/api/notes', async(req, res) => {
    // set required db.json file to variable
    // const db = require('./db/db.json')
    const db = await readFile();
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
app.delete('/api/notes/:id', async(req, res) => {
    // const db = require('./db/db.json');
    const db = await readFile();
    // filter through db and return new array
    const newNoteArr = db.filter(item => {
        return JSON.parse(req.params.id) !== item.id
    })
    // put new updated array to db.json
    fs.writeFile('./db/db.json', JSON.stringify(newNoteArr), (err) => {
        if (err) throw err;
        return res.json(req.params.id)
    })
    console.log('logging',db)
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})
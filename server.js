const http = require('http');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));


// get saved notes and join to db.json
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'))
})

// add new notes to db.json using post
app.post('/api/notes', (req, res) => {
    const notes = fs.readFile('/db/db.json')
    const newNote = req.body;
    // use RegEx to remove spaces for route name 
    newNote.routeName = newNote.name.replace(/\s+/g, '').toLowerCase();
    console.log(newNote);
    // push new notes to notes and return new note obj
    notes.push(newNote);
    res.json(newNote);
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})

// const handleRequest = (req, res) => {
//     const path = req.url;

//     switch (path) {
//         case '/':
//             return fs.readFile(`${__dirname}/public/index.html`, (err, data) => {
//                 if (err) throw err;
//                 res.writeHead(200, { 'Content-Type':'text/html' })
//                 res.end(data);
//             })
        
//         case '/notes': 
//             return fs.readFile($`${__dirname}/public/notes.html`, (err, data) => {
//                 if (err) throw err;
//                 res.writeHead(200, { 'Content-Type':'text/html '})
//                 res.end(data);
//             })
        
//         // renders index.html if none of the above cases are hit
//         default:
//             return fs.readFile(`${__dirname}/public/index.html`, (err, data) => {
//                 if (err) throw err;
//                 res.writeHead(200, { 'Content-Type':'text/html' })
//                 res.end(data);
//         })
//     }
// };

    
// const server = http.createServer(handleRequest);

// server.listen(PORT, () => {
// console.log(`Server is listening on PORT: ${PORT}`)
// });
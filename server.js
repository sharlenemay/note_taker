// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

// Sets up the Express App, Initializes the app
const app = express();
const PORT = process.env.PORT || 8000;

// Sets up the Express app to handle data parsing, middleware for data parsing and handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));//makes code availible through routes as well

// api routes

// GET /api/notes - Should read the db.json file and return all saved notes as JSON.

app.get("/api/notes", function(req, res){
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    res.json(savedNotes);
});

// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
// give unique id to each note
let id = 1;

app.post("/api/notes", function(req, res) {
    let notesData = JSON.parse(fs.readFileSync("./db/db.json"));
    let newNote = req.body;
    newNote.id = id++;
    notesData.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notesData),(err)=>console.log(err||"success!"));
    res.json(true);
  });

app.delete("/api/notes/:id", function(req, res) {
    let notesData = JSON.parse(fs.readFileSync("./db/db.json"));
    let id = parseInt(req.params.id);
    const filtered = notesData.filter(value => value.id !== id);
    fs.writeFile("./db/db.json", JSON.stringify(filtered),(err)=>console.log(err||"deleted note!"));
    res.json(filtered);
});

// html routes

// GET /notes - Should return the notes.html file.
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "./public/notes.html"));
})

// GET * - Should return the index.html file
app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server to begin listening

// test
// const fs = require("fs");
// let rawdata = fs.readFileSync("./db/db.json");
// let test = JSON.parse(rawdata);

app.listen(PORT,function(){
    console.log("App listening on http://localhost:" + PORT);
    // console.log(test);
});
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./public/db/db.json");
const uuid = require("uuid");
const { DH_CHECK_P_NOT_SAFE_PRIME, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
var PORT = process.env.PORT || 3000;
const app = express();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC MIDDLEWARE
app.use(express.static("./public"));

//HTML calls
//calls home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
//call for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//GET API db.json
app.get("/api/notes",function (req, res)  {
    fs.readFile( "public/db/db.json",function(error,data){
        if(error){throw error;}
        let allNotes=JSON.parse(data);
        return res.json(allNotes);
    })
});

// Post function to add new notes to server.json
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./public/db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./public/db/db.json", JSON.stringify(notes))
    res.json(notes);
});

//used for deleting notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./public/db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./public/db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})



//Start listen
app.listen(PORT, function () {
    console.log(`API server now on port ${PORT}!`);
});




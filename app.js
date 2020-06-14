const express = require("express");
const fs = require("fs");
const path = require("path");
let counter = 1;
let dbFilePath = "/db/db.json"
const db = path.join(__dirname, dbFilePath);


// JSON File Stuffs
const dbGET = JSON.parse(
    fs.readFileSync(db, (err, data) => {
        if (err) throw err;
    })
);

const dbPUT = dbGET => {
    let filtered = dbGET.filter(function (el) {
        return el != null;
    });
    fs.writeFileSync(
        path.join(__dirname, dbFilePath),
        JSON.stringify(filtered),
        err => {
            if (err) throw err;
        }
    );
};

// Express settings

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//routes 
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    return res.json(dbGET);
});

// POST
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = counter;
    counter++;
    dbGET.push(newNote);
    dbPUT(dbGET);
    return res.json(dbGET);
});

// Delete Note
app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;

    var note = 1;
    dbGET.splice(`${id - 1}`, 1);
    for (var i = 0; i < dbGET.length; i++) {
        dbGET[i].id = note;
        note = note + 1;
    }
    dbPUT(dbGET);
    res.send(dbGET);
});

// Make it so Number 1 (start the server) 
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
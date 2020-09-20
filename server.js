// DEPENDENCIES NEEDED
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

// SETS UP EXPRESS
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

let savedGlobalNotes = util.promisify(fs.readFile);
function getSavedNotes() {
  console.log("Saved Notes", savedGlobalNotes("./db/db.json", "utf8"));
  return (savedNotes = savedGlobalNotes("./db/db.json", "utf8"));
}

app.get("/api/notes", (req, res) => {
  getSavedNotes()
    .then((savedNotes) => {
      res.send(JSON.parse(savedNotes));
    })
    .catch((err) => res.status(500).json(err));
});

app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let id = crypto.randomBytes(16).toString("hex");
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: id,
  };
  console.log("newNote:", newNote);

  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    console.log("error");
  });
  console.log("New note has been written!");
  return res.json(savedNotes);
});

app.delete("/api/notes/:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = savedNotes.filter((x) => x.id != req.params.id);
  console.log("NOTE ID", noteID);
  console.log("REQ.PARAMS.ID", req.params.id);

  // WRITES NEW NOTES TO DB.JSON
  fs.writeFileSync("./db/db.json", JSON.stringify(noteID), (err) => {
    if (err) throw err;
    console.log("error");
  });
  console.log("Your note has been deleted");
  return res.json(savedNotes);
});

//______________ HTML ROUTES ______________

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});

const express = require('express');
const router = express.Router();
const Note = require('../Models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Route 1: Get all the notes using GET "/api/auth/getuser", Login required

router.get('/fetchnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error!");
    }
   
})

//Route 2:Add a new Note using POST "/api/auth/addnote", Login required
router.post('/addnote',fetchuser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 })
],async (req,res)=>{
    try {
        const { title, description, tag } = req.body;
        //If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const savednote =  await note.save()
    res.json(savednote)

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");  
}
})

//Route 3:Update the existed Note using PUT "/api/notes/updatenote", Login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    const {title, description,tag}=req.body;
    try {
         //NewNote object creation
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //find the note be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.send({note});
    } catch (error) {
        console.error(error.message);
    res.status(500).send("Internal server error!");  
    }
   

})

//Route 4:Delete the existed Note using DELETE "/api/notes/deletenote", Login required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    
try {
    //find the note be deleted and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    //allowed only if user really owns that note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.send({"Success": "This note has been deleted",note:note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!");  
}
    

})


module.exports = router
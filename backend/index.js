require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*", // Allowing requests from all origins, you may want to restrict this in a production environment
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" }); // Fixed res.json({data: "hello"});
});


//backend ready!!

// Create Account 
app.post("/create-account", async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });

    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }

    const user = new User({
        fullname,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user },
        process.env.ACCESS_TOKEN_SECRET, {

    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });

});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

//get user
app.get("/get-user", authenticateToken, async (req,res) =>{
    const {user}= req.user;

    const isUser = await User.findOne({_id:user._id});

    if(!isUser){
        return res.sendStatus(401).sendStatus({error:true, message:"User Not found"});
    }
    return res.json({
        user:isUser,
        message:"User found successfully",
    });
})

//Add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user; // Changed req.user to req

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id, 
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        console.log(error); // Log the error
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }    
    });


// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned= isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//Get All Notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user; 

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//update isPinnedvalue
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const user = req.user; // Removed destructuring because req.user is not an object

    try {
        const note = await Note.findOne({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Updated the condition for setting isPinned
        note.isPinned = isPinned !== undefined ? isPinned : false;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//Search Notes
// app.get("/search-notes/", authenticateToken, async (req, res) => {
//     const { user } = req; // Destructure req.user directly
//     // let { query } = req.query.title; // Extract query from req.query
//     const query = new RegExp(req.query.title);

//     // Check if query parameter is provided and is a string
//     if (!query || typeof query !== 'string') {
//         return res
//             .status(400)
//             .json({ error: true, message: "Search query is required and must be a string" });
//     }

//     query = query.trim(); // Trim whitespace from the query

//     // Check if query is empty after trimming
//     if (!query) {
//         return res
//             .status(400)
//             .json({ error: true, message: "Search query cannot be empty" });
//     }

//     try {
//         // Find notes based on userId and search query
//         const matchingNotes = await Note.find({
//             userId: user._id,
//             $or: [
//                 { title: { $regex: new RegExp(query, "i") } },
//                 { content: { $regex: new RegExp(query, "i") } }
//             ]
//         });

//         // If matching notes are found, return them along with search query
//         if (matchingNotes.length > 0) {
//             return res.json({
//                 error: false,
//                 searchQuery: query,
//                 notes: matchingNotes,
//                 message: "Notes matching the search retrieved successfully"
//             });
//         } else {
//             return res.json({
//                 error: false,
//                 searchQuery: query,
//                 notes: [],
//                 message: "No notes matching the search query"
//             });
//         }

//     } catch (error) {
//         // Handle any errors that occur during the search
//         console.log(error);
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error"
//         });
//     }
// });

app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req; // Destructure req.user directly
    // let { query } = req.query.title; // Extract query from req.query
    const query = new RegExp(req.query.title,"i");
    try{
        const notes = await Note.find({title: query}); // Assuming 'title' is the field you're searching against
        const data = []; // Initialize an empty array to hold the found notes
        notes.forEach(note => {
            data.push(note); // Add each found note to the data array
        });
        res.status(200).json({
            data: data, success: true, message: "successful"
        });


    }
    catch(error){
        console.log(error);
        res.status(404).json({
         success:false, message:"unsuccessful"
        });

    }
})





app.listen(8000, () => {
    console.log("Server is running on 8000");
});

module.exports = app;

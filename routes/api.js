'use strict';
const router = require("express").Router();

const Book = require("../models/Book");

// BOOKS

// CREATE BOOK
router.post("/", async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.send("missing required field title");
        return;
    }
    try {
        const newBook = new Book({ title, comments: [] });
        const dbRes = await newBook.save();
        const { comments, ...rest } = dbRes.toJSON();
        res.json(rest);
    } catch (err) {
        console.log("error when creating a new book", err);
    }
});

// GET BOOKS
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        const result = books.reduce((acc, book) => {
            const rslt = {
                ...book.toJSON(),
                commentcount: book.toJSON().comments.length
            };
            delete rslt.comments;
            acc = [ ...acc, rslt ];
            return acc;
        }, []);
        res.json(result);
    } catch (error) {
        console.log("error when getting books", error);
    }
});

// DELETE ALL BOOKS
router.delete("/", async (req, res) => {
    try {
        const dbRes = await Book.delete();
        res.send("complete delete successful");
    } catch (err) {
        console.log("error while deleting books", err);
    }
});

// BOOK

// CREATE COMMENT
router.post("/:id", async (req, res) => {

});

// GET BOOK WITH COMMENTS
router.get("/:id", async (req, res) => {

});

// DELETE BOOK
router.delete("/:id", async(req, res) => {

});

module.exports = router;
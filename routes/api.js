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
        res.send("error when creating a new book");
        res.sendStatus(400);
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
        res.send("Error when getting books");
        res.sendStatus(400);
        console.log("error when getting books", error);
    }
});

// DELETE ALL BOOKS
router.delete("/", async (req, res) => {
    try {
        const dbRes = await Book.delete();
        res.send("complete delete successful");
    } catch (err) {
        res.sendStatus(400);
        res.send("Error while deleting books");
        console.log("error while deleting books", err);
    }
});

// BOOK

// CREATE COMMENT
router.post("/:id", async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        res.send("missing required field comment");
        return;
    }
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true } );
        if (!book) {
            res.send("no book exists");
            return;
        }
        res.json(book);
    } catch (error) {
        res.sendStatus(400);
        res.send("Error when adding comment");
        console.log("error when adding comment", error);
    }
});

// GET BOOK WITH COMMENTS
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Book.findById(id);
        if (!book) {
            res.send("no book exists");
            return;
        }
        res.json(book);
    } catch (error) {
        res.sendStatus(400);
        res.send("error when getting a book");
        console.log("Error when getting a book", error);
    }
});

// DELETE BOOK
router.delete("/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            res.send("no book is found");
            return;
        }
        res.send("delete successful");
    } catch (error) {
        res.send("Error while deleting");
        res.sendStatus(400);
        console.log("Error while deleting", error);
    }
});

module.exports = router;
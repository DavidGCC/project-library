/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectID } = require("mongodb");

const Book = require("../models/Book");

chai.use(chaiHttp);

suite('Functional Tests', function () {

    /*
    * ----[EXAMPLE TEST]----
    * Each test should completely test the response of the API end-point including response status code!
    */
    test('#example Test GET /api/books', function (done) {
        chai.request(server)
            .get('/api/books')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'response should be an array');
                assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body[0], 'title', 'Books in array should contain title');
                assert.property(res.body[0], '_id', 'Books in array should contain _id');
                done();
            });
    });
    /*
    * ----[END of EXAMPLE TEST]----
    */

    let id1, id2;
    const id = new ObjectID();
    this.beforeEach(async () => {
        await Book.deleteMany();

        const b1 = await new Book({ title: "test1" }).save();
        const b2 = await new Book({ title: "test2" }).save();
        id1 = b1._id.toString();
        id2 = b2._id.toString();
    });

    suite('Routing tests', function () {


        suite('POST /api/books with title => create book object/expect book object', function () {

            test('Test POST /api/books with title', function (done) {
                chai.request(server)
                    .post("/api/books")
                    .send({ title: "The Lord of The Rings" })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.title, "The Lord of The Rings");
                        assert.isDefined(res.body._id);
                        assert.isUndefined(res.body.commentcount);
                        assert.isUndefined(res.body.comments);
                        done();
                    });
            });

            test('Test POST /api/books with no title given', function (done) {
                chai.request(server)
                    .post("/api/books")
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "missing required field title");
                        done();
                    });
            });

        });


        suite('GET /api/books => array of books', function () {

            test('Test GET /api/books', function (done) {
                chai.request(server)
                    .get("/api/books")
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.equal(res.body[0].title, "test1");
                        assert.equal(res.body[0].commentcount, 0);
                        assert.isUndefined(res.body[0].comments);
                        done();
                    });
            });

        });


        suite('GET /api/books/[id] => book object with [id]', function () {

            test('Test GET /api/books/[id] with id not in db', function (done) {
                chai.request(server)
                    .get(`/api/books/${id.toString()}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

            test('Test GET /api/books/[id] with valid id in db', function (done) {
                chai.request(server)
                    .get(`/api/books/${id1}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.type, "application/json");
                        assert.isArray(res.body.comments);
                        assert.equal(res.body.title, "test1");
                        done();
                    });
            });

        });


        suite('POST /api/books/[id] => add comment/expect book object with id', function () {

            test('Test POST /api/books/[id] with comment', function (done) {
                chai.request(server)
                    .post(`/api/books/${id1}`)
                    .send({ comment: "test comment" })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.type, "application/json");
                        assert.equal(res.body.title, "test1");
                        assert.equal(res.body.comments[0], "test comment");
                        done();
                    });
            });

            test('Test POST /api/books/[id] without comment field', function (done) {
                chai.request(server)
                    .post(`/api/books/${id1}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "missing required field comment");
                        done();
                    });
            });

            test('Test POST /api/books/[id] with comment, id not in db', function (done) {
                chai.request(server)
                    .post(`/api/books/${id.toString()}`)
                    .send({ comment: "test comment" })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

        });

        suite('DELETE /api/books/[id] => delete book object id', function () {

            test('Test DELETE /api/books/[id] with valid id in db', function (done) {
                chai.request(server)
                    .delete(`/api/books/${id1}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "delete successful");
                        done();
                    })
            });

            test('Test DELETE /api/books/[id] with  id not in db', function (done) {
                chai.request(server)
                    .delete(`/api/books/${id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, "no book exists");
                        done();
                    });
            });

        });

    });

});

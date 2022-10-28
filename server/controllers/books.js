/*File: controllers/books.js
Student Name: Alexander Maynard
Student ID: 301170707
Application Name: COMP229-Midterm-301170707
Date: 2022-10-28*/


// define the book model
import booksModel from '../models/books.js';

/* GET books List page. READ */
export function displayBookList(req, res, next) {
    // find all books in the books collection
    booksModel.find((err, booksCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }

        //renders the books/list page with the booksCollection
        res.render('index', { title: 'Book List', page: 'books/list', books: booksCollection });
    });
}

//  GET the Book Details page in order to add a new Book
export function displayAddPage(req, res, next) {

    //renders the books/add page
   res.render('index', { title: 'Add Book', page: 'books/add', book: {} })
}

// POST process the Book Details page and create a new Book - CREATE
export function processAddPage(req, res, next) {

    //creates a new book ready for creation based on what the user enters into the text fields
    //on the books/add page
    let newBook = booksModel({
        name: req.body.name,
        author: req.body.author,
        published: req.body.published,
        description: req.body.description,
        price: req.body.price
    });

    //create the book to be added to the database
    booksModel.create(newBook, (err, Book) => {
        
        //if there's an error this provides the proper message and handling
        if(err){
            console.error(err);
            res.end(err);
        };

        //redirects back to the /books/list page after the book creation
        res.redirect('/books/list');
    })
}


// GET the Book Details page in order to edit an existing Book
export function displayEditPage(req, res, next) {

    //assigns id field to the existing one (one we are editing). This id is used to populate the text fields with 
    //the book's existing content.
    let id = req.params.id;


    //finds a SPECIFIC book (with id) and it's contents from mongodb atlas database for modification
    booksModel.findById(id, (err, Book) => {
        
        //if there's an error this provides the proper message and handling
        if(err) {
            console.error(err);
        }

        //renders the books/edit page with content from the book we are looking for
        res.render('index', { title: 'Edit Book', page: 'books/edit', book: Book });
    })
}

// POST - process the information passed from the details form and update the document
export function processEditPage(req, res, next) {

    //assigns id field to the existing one (one we are editing). This id is used to populate the text fields with 
    //the book's new content (or old content if it is not updated).
   let id = req.params.id;

   //creates a new book to update an existing book based on what the user enters (or already exists) into the text fields. 
   let newBook = booksModel({
        _id: req.body.id,
        name: req.body.name,
        author: req.body.author,
        published: req.body.published,
        description: req.body.description,
        price: req.body.price
    });

    //updates an old book based on what the user enters (or already exists) into the text fields. 
   //the right book is updated through the use of updating by id
    booksModel.updateOne({_id: id}, newBook, (err, Book) => {
        
        //if there's an error this provides the proper message and handling
        if(err) {
            console.error(err);
            res.end(err);
        };
    
        //redirects back to the /books/list page after the book update
        res.redirect('/books/list');
    })
}


// GET - process the delete by user id
export function processDelete(req, res, next) {

    //assigns id field to one we want to remove
    let id = req.params.id;

    //deletes the chosen book (by id)
    booksModel.remove({ _id: id }, (err) => {
        
        //if there's an error this provides the proper message and handling
        if(err) {
            console.error(err);
            res.end(err);
        }
        
        //redirects back to the /books/list after the delete
        res.redirect('/books/list');
    })
}
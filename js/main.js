const bookForm = document.querySelector('#bookstore-form');
const bookTitle = document.querySelector('#title');
const bookAuthor = document.querySelector('#author');
const bookIsbn = document.querySelector('#isbn');
const bookList = document.querySelector('.bookList');

//  Classes
//  Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}



//  UI Class
class UI {
    static displayBooks() {
            const books = Store.getBooks();
            books.forEach((book) => UI.addBookToList(book));
        }
        //  add book
    static addBookToList(book) {
        const list = document.querySelector('.bookList');
        const newBook = document.createElement('div');
        //  create new book 
        newBook.innerHTML = `
         <p>${book.title}</p>
         <p>${book.author}</p>
         <p>${book.isbn}</p>
         <span><a href="#" class="delete-book">x</a> </span>
        `;
        list.append(newBook);
    }

    //  clear fields 
    static clearFields() {
        bookTitle.value = '';
        bookAuthor.value = '';
        bookIsbn.value = '';
    }

    //  remove single Book from arr
    static removeBook(el) {
        if (el.classList.contains('delete-book')) {
            el.parentElement.parentElement.remove();
        }
    }

    //  show alert message
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert__${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        container.insertBefore(div, bookForm);
        //   remove after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
}


// Store Class  local storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//  Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//  Add new Book
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //  form values
    const title = bookTitle.value;
    const author = bookAuthor.value;
    const isbn = bookIsbn.value;

    //  validate form
    if (title === '' || author === '' || isbn === '') {
        // alert('Test');
        UI.showAlert('Please insert real value', 'danger');
    } else {
        //  Instantiate Book  from form
        const book = new Book(title, author, isbn);

        //  add Book to UI
        UI.addBookToList(book);

        //  add Book to locale store
        Store.addBook(book);

        //  Show success message
        UI.showAlert('Book added', 'success');

        //  Clear form fields
        UI.clearFields()
    }

})

//  remove single Book
bookList.addEventListener('click', (e) => {
    UI.removeBook(e.target)

    //  message after delete a book
    UI.showAlert('book  removed', 'success');

    //  remove from local store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})
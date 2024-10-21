const booksTable = document.querySelector('#booksTable tbody');
const addBookForm = document.getElementById('addBookForm');

const fetchBooks = async () => {
    const response = await fetch('/books');
    const books = await response.json();
    booksTable.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>
                <button onclick="deleteBook(${book.id})">Delete</button>
                <button onclick="editBook(${book.id})">Edit</button>
            </td>
        `;
        booksTable.appendChild(row);
    });
};

addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newBook = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value
    };

    await fetch('/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    });

    addBookForm.reset();
    fetchBooks();
});

const deleteBook = async (id) => {
    await fetch(`/books/${id}`, {
        method: 'DELETE'
    });
    fetchBooks();
};

const editBook = async (id) => {
    const title = prompt('Enter new title');
    const author = prompt('Enter new author');
    const year = prompt('Enter new year');

    if (title && author && year) {
        const updatedBook = { title, author, year };

        await fetch(`/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });

        fetchBooks();
    }
};

fetchBooks();

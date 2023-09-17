const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal menambahkan buku",
  });
  response.code(400);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name === undefined && reading === undefined && finished === undefined) {
    const response = h.response({
      status: "success",
      data: {
        books: books.map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (name !== undefined) {
    const searchedBook = books.filter((book) => {
      if (book.name.toLowerCase().includes(name.toLowerCase())) {
        return book;
      }
    });

    const response = h.response({
      status: "success",
      data: {
        books: searchedBook.map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    if (reading != 0 && reading != 1) {
      const response = h.response({
        status: "success",
        data: {
          books: books.map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }

    const searchedBook = books.filter((book) => book.reading == reading);
    const response = h.response({
      status: "success",
      data: {
        books: searchedBook.map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    if (finished != 0 && finished != 1) {
      const response = h.response({
        status: "success",
        data: {
          books: books.map((obj) => ({
            id: obj.id,
            name: obj.name,
            publisher: obj.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }

    const searchedBook = books.filter((book) => book.finished == finished);
    const response = h.response({
      status: "success",
      data: {
        books: searchedBook.map((obj) => ({
          id: obj.id,
          name: obj.name,
          publisher: obj.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};

const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const BookSerializer = new JSONAPISerializer('books', {

  attributes: ['title', 'isbn', 'author'],
  
  topLevelLinks: {
    self: 'http://localhost:8000/api/books'
  },

  dataLinks: {
    self: (data) => `http://localhost:8000/api/books/${data.id}`
  }
});

module.exports = BookSerializer;
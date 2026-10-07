# Library REST API Design

This document details the REST API specifications for managing the books resource in the library system.

## Endpoints

### 1. List All Books
- **Method:** GET
- **Path:** `/api/books`
- **Description:** Retrieves a complete list of all books available in the library.
- **Success Status Code:** 200 OK

### 2. List Books by Author (Query Parameter)
- **Method:** GET
- **Path:** `/api/books?author=Jane+Doe`
- **Description:** Retrieves a filtered list of books written by a specified author.
- **Success Status Code:** 200 OK

### 3. Get a Single Book
- **Method:** GET
- **Path:** `/api/books/:id`
- **Description:** Retrieves details for a specific book matching the provided unique identifier.
- **Success Status Code:** 200 OK

### 4. Create a Book
- **Method:** POST
- **Path:** `/api/books`
- **Description:** Adds a brand-new book entry to the library database.
- **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008
  }
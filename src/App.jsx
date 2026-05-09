import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  // ALL books (source of truth)
  const [allBooks, setAllBooks] = useState(() => {
    const storedBooks = localStorage.getItem("books");
    return storedBooks ? JSON.parse(storedBooks) : [];
  });

  // displayed books
  const [books, setBooks] = useState(allBooks);

  const [form, setForm] = useState({
    id: null,
    title: "",
    author: "",
    price: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(allBooks));
    setBooks(allBooks); // keep UI in sync
  }, [allBooks]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      setAllBooks(allBooks.map((b) => (b.id === form.id ? form : b)));
      setIsEditing(false);
    } else {
      setAllBooks([...allBooks, { ...form, id: Date.now() }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      author: "",
      price: "",
      image: "",
    });
  };

  const clearBooks = () => {
    if (!window.confirm("Are you sure you want to clear all books?")) return;
    localStorage.removeItem("books");
    setAllBooks([]);
  };

  const handleEdit = (book) => {
    setForm(book);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setAllBooks(allBooks.filter((b) => b.id !== id));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      setBooks(allBooks);
      return;
    }

    const filtered = allBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );

    setBooks(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">📚 Book Store</h2>

      <div className="d-flex justify-content-end">
        <button className="btn btn-dark" onClick={clearBooks}>
          Clear All
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-1 shadow p-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search books..."
          onChange={handleSearch}
        />

        <div className="d-flex gap-3 p-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Author"
            name="author"
            value={form.author}
            onChange={handleChange}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />

          <button className="btn btn-primary">
            {isEditing ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>

      <div className="row mt-4">
        {books.length === 0 && (
          <p className="text-center">No books available.</p>
        )}

        {books.map((book) => (
          <div className="col-md-3" key={book.id}>
            <div className="card shadow h-100">
              {book.image && (
                <img
                  src={book.image}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5>{book.title}</h5>
                <p>Author: {book.author}</p>
                <p>Price: ${book.price}</p>

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
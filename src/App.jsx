import { useEffect, useState } from "react";
import './App.css';

export default function App() {

  const [books, setBooks] = useState( 
    ()=>{
      const storedBooks = localStorage.getItem("books");
      return storedBooks ? JSON.parse(storedBooks) : []
    }
  )

  const [form, setForm] = useState({
    id:null,
    title:"",
    author:"",
    price:"",
    image:""
  })

  const [isEditing, setIsEditing] = useState(false)

  //save books to local storage
  useEffect(()=>{
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  //handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  //handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    //limit size 2MB
    if(file.size > 2 * 1024 * 1024){
      alert("Image size should be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result
      })
    }
    reader.readAsDataURL(file);
  }

  //handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if(isEditing){
      //update existing book
      setBooks(books.map(b => b.id === form.id ? form : b))
      setIsEditing(false)
    } else {
      //add new book
      setBooks([...books, {...form, id: Date.now()}])
    }
    resetForm();
  }
    //reset form
    const resetForm = () => {
    setForm({
      id:null,
      title:"",
      author:"",
      price:"",
      image:""
    })
  }

  //clear all books  
    const clearBooks = () => {
    if(!window.confirm("Are you sure you want to clear all books?")) return;
    localStorage.removeItem("books");
    setBooks([]);
  }

  //edit
  const handleEdit = (book) => {
    setForm(book)
    setIsEditing(true)
  }

  //delete
  const handleDelete = (id) => {
    setBooks(books.filter(b => b.id !== id))
  }

  //search (bonus)
        // original data
        const [originalBooks, setOriginalBooks] = useState(books);
        //update original data when books change
        useEffect(()=>{
          setOriginalBooks(books)
        }, [books])

        const handleSearch = (e) => {
          const query = e.target.value.toLowerCase();
          if(!query){
            setBooks(originalBooks);
            return;
          }
          const filtered = originalBooks.filter(b => 
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query)
          );
          setBooks(filtered);
        }
  return (
    <>
     <div className="container mt-4">
      <h2 className="text-center">📚Book Store</h2>
     
      <div className="d-flex justify-content-end">
        <button className="btn btn-dark" onClick={clearBooks}>
          Clear All
        </button>
      </div>
      <form onSubmit={handleSubmit}  className="mt-1 shadow p-3">
         {/* search */}
         <input type="text" className="form-control" placeholder="Search books..." onChange={handleSearch} />
         <div className="d-flex gap-3 p-3 ">
        <input type="text" className="form-control" placeholder="Title" name="title" value={form.title} onChange={handleChange} />
        <input type="text" className="form-control" placeholder="Author" name="author" value={form.author} onChange={handleChange} />
        <input type="number" className="form-control" placeholder="Price" name="price" value={form.price} onChange={handleChange} />
        <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        <button  className="btn btn-primary">
          {isEditing ? "Update Book" : "Add Book"}
        </button>
        </div>
      </form>
      <div className="row mt-4">
        {books.length==0 && <p className="text-center">No books available.</p> }
        {books.map(book => (
          <div className="col-md-3" key={book.id}>
            <div className="card shadow h-100">
              {book.image && <img src={book.image} className="card-img-top" alt={book.title} style={{height:"200px", objectFit:"cover"}} />}
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">Author: {book.author}</p>
                <p className="card-text">Price: ${book.price}</p>
                <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>
                  Delete
                </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
     </div>
    </>
  )
} 
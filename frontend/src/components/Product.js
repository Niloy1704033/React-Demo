import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/products';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
      alert('Failed to fetch products');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      alert('All fields are required!');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      await fetchProducts();
      setForm({ name: '', price: '', category: '' });
      setEditingId(null);

      // const modalEl = document.getElementById('productModal');
      // if (window.bootstrap && modalEl) {
      //   const modal = window.bootstrap.Modal.getInstance(modalEl);
      //   if (modal) modal.hide();
      // }

      const modalEl = document.getElementById('productModal');
      if (modalEl) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        } else {
          // fallback in case instance doesn't exist
          new window.bootstrap.Modal(modalEl).hide();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error.message);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);

    const modalEl = document.getElementById('productModal');
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      await fetchProducts();
    } catch (error) {
      console.error('Delete failed:', error.message);
      alert('Delete failed');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Product List</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
{/* 
        <button
          className="btn btn-primary ms-3"
          data-bs-toggle="modal"
          data-bs-target="#productModal"
          onClick={() => {
            setForm({ name: '', price: '', category: '' });
            setEditingId(null);
          }}
        >
          Add Product
        </button> */}

        <button
          className="btn btn-primary"
          onClick={() => {
            setForm({ name: '', price: '', category: '' });
            setEditingId(null);
            const modal = new window.bootstrap.Modal(document.getElementById('productModal'));
            modal.show();
          }}
        >
          Add Product
        </button>

      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No matching products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-hidden="true"
        aria-labelledby="productModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="productModalLabel">
                {editingId ? 'Update Product' : 'Add Product'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;




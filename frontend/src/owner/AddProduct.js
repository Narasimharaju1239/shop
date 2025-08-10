import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    details: '', // New field for product details
    price: '',
    offer: '',
    gst: '',
    hsnCode: '',
    image: null
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    try {
      await API.post('/products', data); // Adjust endpoint if needed
      toast.success('Product added!');
      setForm({ name: '', description: '', details: '', price: '', offer: '', gst: '', hsnCode: '', image: null });
    } catch {
      toast.error('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 20, background: '#f5f5f5', borderRadius: 10 }}>
      <h2>Add Product</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: '100%', marginBottom: 10 }} />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ width: '100%', marginBottom: 10 }} />
      <textarea name="details" value={form.details} onChange={handleChange} placeholder="Product Details" style={{ width: '100%', marginBottom: 10 }} />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required style={{ width: '100%', marginBottom: 10 }} />
      <input name="offer" type="number" value={form.offer} onChange={handleChange} placeholder="Offer (%)" style={{ width: '100%', marginBottom: 10 }} />
      <input name="gst" type="number" value={form.gst} onChange={handleChange} placeholder="GST (%)" style={{ width: '100%', marginBottom: 10 }} />
      <input name="hsnCode" value={form.hsnCode} onChange={handleChange} placeholder="HSN Code" style={{ width: '100%', marginBottom: 10 }} />
      <input name="image" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%', marginBottom: 10 }} />
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00796b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Product</button>
    </form>
  );
};

export default AddProduct;

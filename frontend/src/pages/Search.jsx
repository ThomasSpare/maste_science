import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@cds/core/select/register.js';
import './Search.css';

function Search() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    uploadDate: '',
    author: '',
    country: ''
  });


  useEffect(() => {
    fetch('http://localhost:8000/api/uploads')
      .then(response => response.json())
      .then(data => setUploads(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const filteredUploads = uploads.filter(upload => {
    const { category, uploadDate, author, country } = filter;
    return (
      (category === '' || upload.category === category) &&
      (uploadDate === '' || upload.uploaddate === uploadDate) &&
      (author === '' || upload.author === author) &&
      (country === '' || upload.country === country)
    );
  });

  const handleFileClick = (upload) => {
    const fileId = upload.id; // Adjust based on your data structure
    navigate(`/view-pdf/${fileId}/${upload.file}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "100px" }}>Category:</label>
          <input type="text" name="category" value={filter.category} onChange={handleFilterChange} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "100px" }}>Upload Date:</label>
          <input type="date" name="uploadDate" value={filter.uploadDate} onChange={handleFilterChange} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "100px" }}>Author:</label>
          <input type="text" name="author" value={filter.author} onChange={handleFilterChange} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "inline-block", width: "100px" }}>Country:</label>
          <select name="country" value={filter.country} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Albania">Albania</option>
            <option value="Andorra">Andorra</option>
            <option value="Austria">Austria</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Croatia">Croatia</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Estonia">Estonia</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Greece">Greece</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="Ireland">Ireland</option>
            <option value="Italy">Italy</option>
            <option value="Kosovo">Kosovo</option>
            <option value="Latvia">Latvia</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Malta">Malta</option>
            <option value="Moldova">Moldova</option>
            <option value="Monaco">Monaco</option>
            <option value="Montenegro">Montenegro</option>
            <option value="Netherlands">Netherlands</option>
            <option value="North Macedonia (formerly Macedonia)">North Macedonia (formerly Macedonia)</option>
            <option value="Norway">Norway</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Romania">Romania</option>
            <option value="Russia">Russia</option>
            <option value="San Marino">San Marino</option>
            <option value="Serbia">Serbia</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Spain">Spain</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Kingdom (UK)">United Kingdom (UK)</option>
            <option value="Vatican City (Holy See)">Vatican City (Holy See)</option>
          </select>
        </div>
        <ol>
          {filteredUploads.sort((a, b) => new Date(b.uploaddate) - new Date(a.uploaddate)).map((upload, index) => (
            <li key={index} onClick={() => handleFileClick(upload)}>
              <p style={{ display: "inline-block", marginRight: "50px" }}>Upload Date: {upload.uploaddate}</p>
              <p style={{ display: "inline-block", marginRight: "50px" }}>Category: {upload.category}</p>
              <p style={{ display: "inline-block", marginRight: "50px" }}>Country: {upload.country}</p>
              <p style={{ display: "inline-block", marginRight: "50px" }}>Author: {upload.author}</p>
              <p style={{ display: "inline-block", marginRight: "50px" }}>ID: {upload.id}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Search;
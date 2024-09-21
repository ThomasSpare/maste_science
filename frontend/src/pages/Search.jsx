import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CdsButton } from '@cds/react/button'; // Ensure this is the correct import for your button component
import { useNavigate } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { getCountryCode } from '../countrycodes/countryCodes'; // Import the utility function
import "./Search.css";
import "../App.css"; 

const Search = () => {
  const [uploads, setUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  useEffect(() => {
    // Fetch uploads from the server
    const fetchUploads = async () => {
      try {
        const response = await api.get('/api/uploads');
        const data = response.data;
        console.log("Fetched uploads:", data); // Add this line
        setUploads(data);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      }
    };

    fetchUploads();
  }, [api]);

  const handleFileClick = (upload) => {
    console.log("Navigating to:", `/view-pdf/${upload.id}/${upload.file_key}`);
    navigate(`/view-pdf/${upload.id}/${upload.file_key}`);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setCurrentPage(1); // Reset to the first page on date change
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setCurrentPage(1); // Reset to the first page on date change
  };

  const filteredUploads = uploads.filter((upload) => {
    const uploadDate = new Date(upload.upload_date);
    const isWithinDateRange =
      (!startDate || uploadDate >= new Date(startDate)) &&
      (!endDate || uploadDate <= new Date(endDate));
    const matchesSearchTerm =
      upload.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.author.toLowerCase().includes(searchTerm.toLowerCase());
    return isWithinDateRange && matchesSearchTerm;
  });

  // Sort the filtered uploads by upload date in descending order
  const sortedUploads = filteredUploads.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUploads = sortedUploads.slice(startIndex, endIndex);

  return (
    <div className='search-main-div'>
      <h1 className='search-h1'>Search PDF</h1>
      <div>
        <input className='search-input'
          type="text"
          placeholder="Search by Title, country, or author"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
        />
        <div style={{ marginBottom: '20px' }}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              style={{ marginLeft: '10px', marginRight: '20px' }}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <ol>
          {paginatedUploads.map((upload, index) => (
            <li className="search-list-item" key={index} onClick={() => handleFileClick(upload)}>
              <div className='top'>
                <p style={{ display: 'inline-block', marginRight: '50px' }}>
                  Title: {upload.category}
                </p>
                <p style={{ display: 'inline-block', marginRight: '50px' }}>
                  Author: {upload.author}
                </p>
              </div>
              <div className='bottom'>
                <p style={{ display: 'inline-block', marginRight: '50px' }}>
                  Upload Date: {new Date(upload.upload_date).toLocaleDateString()}
                </p>
                <p style={{ display: 'inline-block', marginRight: '50px' }}>
                  Country: {upload.country} <ReactCountryFlag countryCode={getCountryCode(upload.country)} svg />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: '10px' }}>
          <CdsButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </CdsButton>
          <CdsButton onClick={handleNextPage} disabled={endIndex >= sortedUploads.length}>
            Next
          </CdsButton>
        </div>
      </div>
    </div>
  );
};

export default Search;
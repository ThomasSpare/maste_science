import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CdsButton } from '@cds/react/button';
import { useNavigate } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { getCountryCode } from '../countrycodes/countryCodes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './SearchPowerPoint.css';
import '../App.css';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const SearchPowerPoint = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Fetch uploads from the server
    const fetchUploads = async () => {
      try {
        const response = await api.get('/api/uploads');
        const data = response.data;
        setUploads(data.filter(upload => upload.is_template));
      } catch (error) {
        console.error('Error fetching uploads:', error);
      }
    };

    fetchUploads();
  }, []);

  const handleDownloadClick = async (upload) => {
    const confirmDownload = window.confirm('Do you want to download this file?');
    if (confirmDownload) {
      try {
        const response = await api.get(`/api/uploads/${upload.file_key}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', upload.file_url.split('/').pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
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
      <h1 className='search-h1'>Search PowerPoint Templates</h1>
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
        <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
          <span style={{ flex: '2' }}>Title</span>
          <span style={{ flex: '2' }}>Author</span>
          <span style={{ flex: '0.75' }}>Upload Date</span>
          <span style={{ flex: '0.75' }}>File Type</span>
          <span style={{ flex: '0.75', textAlign: 'right' }}>Country</span>
          <span style={{ flex: '0.5', textAlign: 'right' }}>Download</span>
        </div>
        <ol>
          {paginatedUploads.map((upload, index) => (
            <li className="search-list-item" key={index}>
              <div className='list-info' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ flex: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {upload.category.length > 65 ? `${upload.category.substring(0, 65)}...` : upload.category}
                </p>
                <p style={{ flex: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {upload.author.length > 60 ? `${upload.author.substring(0, 60)}...` : upload.author}
                </p>
                <p style={{ flex: '0.75' }}>
                  {new Date(upload.upload_date).toLocaleDateString()}
                </p>
                <p style={{ flex: '0.75' }}>
                  {upload.file_url ? upload.file_url.split('.').pop() : 'N/A'}
                </p>
                <p style={{ flex: '0.75', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0px !important' }}>
                  {upload.country} <ReactCountryFlag countryCode={getCountryCode(upload.country)} svg />
                </p>
                <p style={{ flex: '0.5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <FontAwesomeIcon className='download' icon={faDownload} onClick={() => handleDownloadClick(upload)} style={{ cursor: 'pointer' }} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', minHeight: '100vh' }}>
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

export default SearchPowerPoint;
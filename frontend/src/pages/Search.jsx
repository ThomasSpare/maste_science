import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { CdsButton } from '@cds/react/button'; // Ensure this is the correct import for your button component
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFolder, faFolderOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "./Search.css";
import "../App.css"; 
import { useAuth0 } from '@auth0/auth0-react';

const Search = () => {
  const [items, setItems] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  useEffect(() => {
    // Fetch folders and single files from the server
    const fetchData = async () => {
      try {
        const folderResponse = await api.get('/api/folders');
        const singleFileResponse = await api.get('/api/uploads');
        const folderData = folderResponse.data.map(folder => ({ ...folder, type: 'folder' }));
        const singleFileData = singleFileResponse.data.filter(file => !file.folder_id).map(file => ({ ...file, type: 'file' }));
        const combinedData = [...folderData, ...singleFileData];
        setItems(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [api]);

  useEffect(() => {
    if (user) {
      console.log('Logged in user details:', user);
    }
  }, [user]);

  const handleFolderClick = (folderId) => {
    setExpandedFolders((prevExpandedFolders) => ({
      ...prevExpandedFolders,
      [folderId]: !prevExpandedFolders[folderId],
    }));
  };

  const handleFileClick = (upload) => {
    console.log('File author:', upload.author); // Log the author of the file clicked
    console.log('Current user:', user.name); // Log the current user
    const fileExtension = upload.file_url.split('.').pop();
    const encodedFileKey = encodeURIComponent(upload.file_key);
    if (upload.is_promotion || ['jpg', 'png', 'svg'].includes(fileExtension)) {
      navigate(`/view-img/${upload.id}/${encodedFileKey}`);
    } else if (['ppt', 'pptx'].includes(fileExtension)) {
      navigate(`/view-ppt/${upload.id}/${encodedFileKey}`);
    } else if (['doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'].includes(fileExtension)) {
      navigate(`/view-text/${upload.id}/${encodedFileKey}`);
    } else {
      navigate(`/view-pdf/${upload.id}/${encodedFileKey}`);
    }
  };

  const handleDownloadClick = async (folder) => {
    const confirmDownload = window.confirm('Do you want to download this folder?');
    if (confirmDownload) {
      try {
        for (const file of folder.files) {
          const endpoint = (file.file_url.split('.').pop() === 'ppt' || file.file_url.split('.').pop() === 'pptx') 
              ? `/api/download-ppt/${file.file_key}` 
              : `/api/uploads/${file.file_key}`;
          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const blob = await response.blob();
          saveAs(blob, file.file_url.split('/').pop());
        }
      } catch (error) {
        console.error('Error downloading folder:', error);
      }
    }
  };

  const handleDeleteClick = async (id, type) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        const token = await getAccessTokenSilently();
        await api.delete(`/api/uploads/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the data after deletion
        const folderResponse = await api.get('/api/folders');
        const singleFileResponse = await api.get('/api/uploads');
        const folderData = folderResponse.data.map(folder => ({ ...folder, type: 'folder' }));
        const singleFileData = singleFileResponse.data.filter(file => !file.folder_id).map(file => ({ ...file, type: 'file' }));
        const combinedData = [...folderData, ...singleFileData];
        setItems(combinedData);
      } catch (error) {
        console.error('Error deleting item:', error);
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

  const filteredItems = items.filter((item) => {
    const uploadDate = new Date(item.upload_date);
    const isWithinDateRange =
      (!startDate || uploadDate >= new Date(startDate)) &&
      (!endDate || uploadDate <= new Date(endDate));
    const matchesSearchTerm =
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return isWithinDateRange && matchesSearchTerm;
  });

  // Sort the filtered items by upload date in descending order
  const sortedItems = filteredItems.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  return (
    <div className='search-main-div'>
      <h1 className='search-h1'>Search all files in the Database</h1>
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
          <span style={{ flex: '1.5' }}>Title</span>
          <span style={{ flex: '1' }}>Author</span>
          <span style={{ flex: '1' }}>Upload Date</span>
          <span style={{ flex: '1.25' }}>Type of work</span>
          <span style={{ flex: '1.75' }}>Download</span>
          <span style={{ flex: '0.5' }}>File Type</span>
        </div>
        <ol>
          {paginatedItems.map((item, index) => (
            <li className="search-list-item" key={index} onClick={() => item.type === 'folder' ? handleFolderClick(item.id) : handleFileClick(item)}>
              <div className='list-info' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ flex: '2.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.type === 'folder' ? (item.folder_name.length > 65 ? `${item.folder_name.substring(0, 65)}...` : item.folder_name) : (item.file_key.split('/').pop().length > 65 ? `${item.file_key.split('/').pop().substring(0, 65)}...` : item.file_key.split('/').pop())}
                </p>
                <p style={{ flex: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.author.length > 60 ? `${item.author.substring(0, 60)}...` : item.author}
                </p>
                <p style={{ flex: '1.5' }}>
                  {new Date(item.upload_date).toLocaleDateString()}
                </p>
                <p style={{ flex: '2' }}>
                  {item.is_public && 'Public'}
                  {item.workpackage && `${item.workpackage}`}
                  {item.is_meeting && 'Meeting'}
                  {item.is_deliverable && 'Deliverable'}
                  {item.is_contact_list && 'Contact List'}
                  {item.is_promotion && 'Promotion'}
                  {item.is_report && 'Report'}
                  {item.is_publication && 'Publication'}
                  {item.is_template && 'Template'}
                </p>
                <p style={{ flex: '0.5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {item.type === 'folder' && <FontAwesomeIcon className='folder' icon={expandedFolders[item.id] ? faFolderOpen : faFolder} style={{ cursor: 'pointer', marginLeft: '10px', color: 'coral', position: 'relative' }} />}
                  {user && (
                    <FontAwesomeIcon className='delete' icon={faTrashAlt} onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id, item.type); }} style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} />
                  )}
                </p>
              </div>
              {item.type === 'folder' && expandedFolders[item.id] && (
                <Card variant="outlined" sx={{ maxWidth: 1000, backgroundColor: 'coral', opacity: '1' }}>
                <CardContent>
                <ul>
                  {item.files && item.files.map((file, fileIndex) => (
                    <li key={fileIndex} className="folder-search-list-item" onClick={() => handleFileClick(file)}>
                      <div className='folder-list-info' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ flex: '2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.file_key.split('/').pop().length > 40 ? `${file.file_key.split('/').pop().substring(0, 40)}...` : file.file_key.split('/').pop()}
                        </p>
                        <p style={{ flex: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.author.length > 60 ? `${file.author.substring(0, 60)}...` : file.author}
                        </p>
                        <p style={{ flex: '2' }}>
                          {new Date(file.upload_date).toLocaleDateString()}
                        </p>
                        <p style={{ flex: '0.75' }}>
                          {file.file_url ? file.file_url.split('.').pop() : 'N/A'}
                        </p>
                        {user && (
                          <FontAwesomeIcon className='delete' icon={faTrashAlt} onClick={(e) => { e.stopPropagation(); handleDeleteClick(file.id, 'file'); }} style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                </CardContent>
                </Card>
              )}
            </li>
          ))}
        </ol>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
          <CdsButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </CdsButton>
          <CdsButton onClick={handleNextPage} disabled={endIndex >= sortedItems.length}>
            Next
          </CdsButton>
        </div>
      </div>
    </div>
  );
};

export default Search;
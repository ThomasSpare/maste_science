import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { CdsButton } from '@cds/react/button';
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
  const [user_nickname, setUserNickname] = useState('');
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const { user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:10000', // Fallback to localhost if the environment variable is not set
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:files read:folders",
          },
        });
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const folderResponse = await api.get('/api/folders', { headers });
        const singleFileResponse = await api.get('/api/uploads', { headers });
    

        const folderData = folderResponse.data.folders.map(folder => ({ ...folder, type: 'folder' }));
        const singleFileData = singleFileResponse.data.files.map(file => ({ ...file, type: 'file' }));
        const combinedData = [...folderData, ...singleFileData];
        setItems(combinedData);
      } catch (error) {
        console.error('Fetch error:', {
          message: error.message,
          scopes: error.scope || 'N/A'
        });
        if (error.error === 'consent_required') {
          await loginWithRedirect({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
              scope: "openid profile email read:files read:folders",
              prompt: "consent"
            },
            appState: {
              returnTo: window.location.pathname
            }
          });
        }
      }
    };
    
    fetchData();
  }, [getAccessTokenSilently, loginWithRedirect, api, user]);

  useEffect(() => {
    if (user) {
      const user_nickname = user.nickname.replace('.', ' ').replace(/\b\w/g, char => char.toUpperCase());
      setUserNickname(user_nickname);
      // User details can be used here if needed
    }
  }, [user, user_nickname]);

  const handleFolderClick = (folderId) => {
    setExpandedFolders((prevExpandedFolders) => ({
      ...prevExpandedFolders,
      [folderId]: !prevExpandedFolders[folderId],
    }));
  };

  const handleFileClick = (upload) => {
    const fileExtension = upload.file_url.split('.').pop();
    // Use file_key directly instead of encoding it again
    if (upload.is_promotion || ['jpg', 'png', 'svg'].includes(fileExtension)) {
      navigate(`/view-img/${upload.id}/${upload.file_key}`);
    } else if (['ppt', 'pptx'].includes(fileExtension)) {
      navigate(`/view-ppt/${upload.id}/${upload.file_key}`);
    } else if (['doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'].includes(fileExtension)) {
      navigate(`/view-text/${upload.id}/${upload.file_key}`);
    } else {
      navigate(`/view-pdf/${upload.id}/${upload.file_key}`);
    }
  };

  const handleDownloadClick = async (folder) => {
    const confirmDownload = window.confirm('Do you want to download this folder?');
    if (confirmDownload) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'read:files create:files delete:files read:folders delete:folders',
          }
        });
        const headers = {
          Authorization: `Bearer ${token}`
        };
        
        const response = await api.get(`/api/download-folder/${folder.id}`, {
          headers,
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'application/zip' });
        saveAs(blob, `${folder.folder_name}.zip`);
      } catch (error) {
        console.error('Error downloading folder:', error);
      }
    }
  };

  const handleDeleteClick = async (id, user, author, user_nickname) => {
    if (user_nickname !== author) {
      alert('You can only delete files that you have uploaded');
      return;
    }
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'read:files create:files delete:files read:folders delete:folders',
          }
        });
        const headers = {
          Authorization: `Bearer ${token}`
        };
        await api.delete(`/api/uploads/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const folderResponse = await api.get('/api/folders', { headers });
        const singleFileResponse = await api.get('/api/uploads', { headers });
        const folderData = folderResponse.data.folders.map(folder => ({ ...folder, type: 'folder' }));
        const singleFileData = singleFileResponse.data.files.map(file => ({ ...file, type: 'file' }));
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
    setCurrentPage(1);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setCurrentPage(1);
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
          <span style={{ flex: '2.5' }}>Title</span>
          <span style={{ flex: '1.3' }}>Author</span>
          <span style={{ flex: '1.3' }}>Upload Date</span>
          <span style={{ flex: '1' }}>Type of work</span>
          <span style={{ flex: '1.5' }}>Download</span>
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
                  {item.is_public && 'Public '}
                  {item.workpackage && item.workpackage !== 'null' && `${item.workpackage} `}
                  {item.is_meeting && 'Meeting '}
                  {item.is_deliverable && 'Deliverable '}
                  {item.is_contact_list && 'Contact List '}
                  {item.is_promotion && 'Promotion '}
                  {item.is_report && 'Report '}
                  {item.is_publication && 'Publication '}
                  {item.is_template && 'Template'}
                </p>
                <p style={{ flex: '0.5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {item.type === 'folder' && (
                    <>
                      <FontAwesomeIcon 
                        className='folder' 
                        icon={expandedFolders[item.id] ? faFolderOpen : faFolder} 
                        style={{ cursor: 'pointer', marginLeft: '10px', color: 'coral' }} 
                        onClick={() => handleFolderClick(item.id)} 
                      />
                      <FontAwesomeIcon 
                        className='download' 
                        icon={faDownload} 
                        onClick={(e) => { e.stopPropagation(); handleDownloadClick(item); }} 
                        style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }} 
                      />
                    </>
                  )}
                  {user_nickname === item.author && (
                    <FontAwesomeIcon 
                      className='delete' 
                      icon={faTrashAlt} 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteClick(item.id, item.type, item.author, user_nickname); 
                      }} 
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} 
                    />
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
                              {file.author_name.length > 60 ? `${file.author_name.substring(0, 60)}...` : file.author_name}
                            </p>
                            <p style={{ flex: '2' }}>
                              {new Date(file.upload_date).toLocaleDateString()}
                            </p>
                            <p style={{ flex: '0.75' }}>
                              {file.file_url ? file.file_url.split('.').pop() : 'N/A'}
                            </p>
                            {user_nickname === file.author && (
                              <FontAwesomeIcon 
                                className='delete' 
                                icon={faTrashAlt} 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleDeleteClick(file.id, file.type, file.author); 
                                }} 
                                style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }} 
                              />
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
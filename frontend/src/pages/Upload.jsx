import React, { useEffect, useState } from 'react';
import "./Upload.css";
import "../App.css";
import { CdsButton } from '@cds/react/button';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [author, setAuthor] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [folderName, setFolderName] = useState(''); // Add state for folder name
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [workpackage, setWorkpackage] = useState('');
  const [isMeeting, setIsMeeting] = useState(false);
  const [isDeliverable, setIsDeliverable] = useState(false);
  const [isContactList, setIsContactList] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isPublication, setIsPublication] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);

  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, user } = useAuth0();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  useEffect(() => {
    setUploadDate(new Date().toISOString().split('T')[0]);
    setIsAuthenticatedState(isAuthenticated);
    if (user && user.name) {
      setAuthor(user.name); // Set the author to the logged-in user's name
    }
  }, [isAuthenticated, user]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (files.length === 0 || !author || !category) {
      alert("Please submit all fields");
      return;
    }

    try {
      if (!isAuthenticatedState) {
        console.error('User is not authenticated');
        alert('You need to be logged in to upload files.');
        await loginWithRedirect();
        return;
      }

      const token = await getAccessTokenSilently();

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file); // Ensure the field name is 'files'
      });
      formData.append('author', author); // Set the author to the logged-in user's name
      formData.append('uploadDate', uploadDate);
      formData.append('country', country);
      formData.append('category', category);
      formData.append('isPublic', isPublic);
      formData.append('workpackage', workpackage || null); // Handle empty workpackage
      formData.append('isMeeting', isMeeting);
      formData.append('isDeliverable', isDeliverable);
      formData.append('isContactList', isContactList);
      formData.append('isPromotion', isPromotion);
      formData.append('isReport', isReport);
      formData.append('isPublication', isPublication);
      formData.append('isTemplate', isTemplate);
      if (files.length > 1) {
        formData.append('folderName', folderName); // Add folder name to form data if multiple files
      }

      const response = await api.post('/api/uploads', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Files uploaded successfully');
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  const currentDate = new Date().toISOString().split('T')[0];

  const europeanCountries = [
    'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia (formerly Macedonia)', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom (UK)', 'Vatican City (Holy See)',
  ];

  return (
    <div className="Center">
      <form encType='multipart/form-data' className="clr-form" clrLayout="horizontal" onSubmit={handleUpload}>
        <label>Upload Files</label>
        <input
          type="file"
          id="files"
          name='files'
          accept=".pdf, .ppt, .pptx, .doc, .docx, .xls, .xlsx, .csv, .txt, .jpg, .jpeg, .png"
          multiple
          onChange={e => setFiles(Array.from(e.target.files))}
        />
        {files.length > 1 && (
          <>
            <label htmlFor="folderName">Folder Name</label>
            <input
              type="text"
              id="folderName"
              placeholder="Folder Name"
              value={folderName}
              onChange={e => setFolderName(e.target.value)}
              autoFocus
            />
          </>
        )}
        <div className="horizontal-container">
          <select
            id="workpackage"
            value={workpackage}
            onChange={e => setWorkpackage(e.target.value)}
          >
            <option value="">None</option>
            <option value="WP1">WP1</option>
            <option value="WP2">WP2</option>
            <option value="WP3">WP3</option>
            <option value="WP4">WP4</option>
            <option value="WP5">WP5</option>
            <option value="WP6">WP6</option>
          </select>
          <label style={{ color: 'white' }} htmlFor="workpackage">-- Select Workpackage for this upload</label>
        </div>
        <hr className="divider" />
        <div style={{ color: 'white', marginBottom: '5px', textDecorationStyle: 'solid' }}>
          Check any selection relevant for this file
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="isPublic"
            value={isPublic}
            name="isPublic"
            onChange={e => setIsPublic(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isPublic">- Public Document</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isMeeting}
            id="isMeeting"
            name="isMeeting"
            onChange={e => setIsMeeting(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isMeeting">- Meeting</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isDeliverable}
            id="isDeliverable"
            name="isDeliverable"
            onChange={e => setIsDeliverable(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isDeliverable">- Deliverable</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isContactList}
            id="contactList"
            name="contactList"
            onChange={e => setIsContactList(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="contactList">- Contact List</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isPromotion}
            id="isPromotion"
            name="isPromotion"
            onChange={e => setIsPromotion(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isPromotion">- Promotion Material</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isReport}
            id="isReport"
            name="isReport"
            onChange={e => setIsReport(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isReport">- Report</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isPublication}
            id="isPublication"
            name="isPublication"
            onChange={e => setIsPublication(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isPublication">- Publication</label>
        </div>
        <div className="clr-checkbox">
          <input
            type="checkbox"
            value={isTemplate}
            id="isTemplate"
            name="isTemplate"
            onChange={e => setIsTemplate(e.target.checked)}
          />
          <label style={{ color: 'white' }} htmlFor="isTemplate">- Template</label>
        </div>

        <label htmlFor="category">Title</label>
        <input
          type="text"
          id="category"
          placeholder="Title"
          value={category}
          onChange={e => setCategory(e.target.value)}
          autoFocus
        />
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          placeholder="Author"
          value={author}
          readOnly // Make the author field read-only
        />

        <label htmlFor="uploadDate">Upload Date</label>
        <input
          type="text"
          id="uploadDate"
          placeholder="Upload Date"
          value={currentDate}
          onChange={e => setUploadDate(e.target.value)}
          autoFocus
        />

        <label htmlFor="country">Country</label>
        <select
          id="country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          <option value="">Select a country</option>
          {europeanCountries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <CdsButton className="clr-button" type='submit' onClick={(e) => {
            if (isPublic && !window.confirm('You have choosen to make this file public, are you sure ?')) {
            e.preventDefault();
            setIsPublic(false);
            }
        }}>
          Upload
        </CdsButton>
      </form>
    </div>
  );
}

export default Upload;
import React, { useEffect, useState } from 'react';
import "./Upload.css";
import "../App.css";
import { CdsButton } from '@cds/react/button';
import { useAuth0 } from '@auth0/auth0-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    setUploadDate(new Date().toISOString().split('T')[0]);
    setIsAuthenticatedState(isAuthenticated);
  }, [isAuthenticated]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !author || !country || !category) {
      alert("Please submit all fields");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('author', author);
    formData.append('uploadDate', uploadDate);
    formData.append('country', country);
    formData.append('category', category);

    console.log("Form data being sent:", {
      file,
      author,
      uploadDate,
      country,
      category,
    });

    try {
      if (!isAuthenticatedState) {
        console.error('User is not authenticated');
        alert('You need to be logged in to upload files.');
        await loginWithRedirect();
        return;
      }

      const token = await getAccessTokenSilently();

      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      alert('File uploaded successfully');
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
        <label>Upload File</label>
        <input
          type="file"
          id="file"
          name='file'
          accept=".pdf, .ppt, .pptx"
          onChange={e => setFile(e.target.files[0])}
        />

        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          placeholder="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          autoFocus
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

        <label htmlFor="category">Title</label>
        <input
          type="text"
          id="category"
          placeholder="Title"
          value={category}
          onChange={e => setCategory(e.target.value)}
          autoFocus
        />

        <CdsButton className="clr-button" type='submit'>
          Upload
        </CdsButton>
      </form>
    </div>
  );
}

export default Upload;
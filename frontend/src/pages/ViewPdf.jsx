import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ViewPdf = () => {
  const { fileId, fileKey } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // Ensure this path is correct

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("Params:", { fileId, fileKey });
    if (!fileKey) {
      console.error("File parameter is undefined.");
      return;
    }

    const fetchPdf = async () => {
      try {
        const token = await getAccessTokenSilently();
        const serverAddress = process.env.REACT_APP_API_BASE_URL; // Update this to your server address
        const url = `${serverAddress}/api/uploads/${fileKey}`;
        
        const response = await fetch(url, {
          signal,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchPdf();

    return () => {
      abortController.abort();
      // Clean up the object URL to avoid memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileKey, getAccessTokenSilently, fileUrl]);

  return (
    <iframe
      title="PDF Viewer"
      src={fileUrl}
      style={{ width: '100%', height: '100vh'}}
    />
  );
}

export default ViewPdf;
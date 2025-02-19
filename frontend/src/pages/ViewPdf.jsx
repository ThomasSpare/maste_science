import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ViewPdf = () => {
  const { fileKey } = useParams();
  const [fileUrl, setFileUrl] = useState('');
  const { getAccessTokenSilently } = useAuth0(); // Get the token function

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPdf = async () => {
      try {
        if (!fileKey) {
          console.error("File parameter is undefined.");
          return;
        }
    
        // Get the authentication token with correct scope format
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:files read:folders delete:files",  // Add all required scopes
          },
        });
    
        const serverAddress = process.env.REACT_APP_API_BASE_URL;
        // Decode the fileKey since it might be URL encoded
        const decodedFileKey = decodeURIComponent(fileKey);
        const url = `${serverAddress}/api/uploads/${decodedFileKey}`;
        
        console.log('Requesting file:', decodedFileKey); // Debug log
    
        const response = await fetch(url, { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          }
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileKey, getAccessTokenSilently]); // Add getAccessTokenSilently to dependencies

  return (
    <iframe
      title="PDF Viewer"
      src={fileUrl}
      style={{ width: '100%', height: '100vh'}}
    />
  );
}

export default ViewPdf;
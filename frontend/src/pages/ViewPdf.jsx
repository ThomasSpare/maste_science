import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ViewPdf = () => {
  const { fileId, fileKey } = useParams();
  const [fileUrl, setFileUrl] = useState('');
  useAuth0(); // Ensure this path is correct

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("Params:", { fileId, fileKey });
    if (!fileKey) {
      console.error("File parameter is undefined.");
      return;
    }
    const serverAddress = process.env.REACT_APP_API_BASE_URL; // Update this to your server address
    const url = `${serverAddress}/api/uploads/${fileKey}`;
    
    fetch(url, { signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // Create an object URL from the Blob object
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
      });

    return () => {
      abortController.abort();
      // Clean up the object URL to avoid memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileKey]); // Add fileKey to the dependency array

  return (
    <iframe
      title="PDF Viewer"
      src={fileUrl}
      style={{ width: '100%', height: '100vh'}}
    />
  );
}

export default ViewPdf;
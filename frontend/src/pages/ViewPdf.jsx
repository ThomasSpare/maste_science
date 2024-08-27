import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // Ensure this path is correct


const ViewPdf = () => {
  const { file, fileId } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState('');
  useAuth(); // Ensure this path is correct

  useEffect((isLoggedIn) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("Params:", { file, fileId });
    if (!file) {
      console.error("File parameter is undefined.");
      return;
    }
    const serverAddress = 'https://maste-science-backend.onrender.com/'; 
    const url = `${serverAddress}/api/uploads/${file}`;
    
    fetch(url, { signal })
      .then(response => response.blob())
      .then(blob => {
        // Rename the variable to avoid conflict with the `file` parameter
        const pdfFile = new File([blob], `${file}.pdf`, { type: 'application/pdf' });
        // Create an object URL from the File object
        const objectUrl = URL.createObjectURL(pdfFile);
        setFileUrl(objectUrl);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
      });

    // This navigation seems redundant if you're already on the page you want to be, consider removing it
    // or ensure it's necessary for your app's flow
    const newUrl = `/view-pdf/${fileId}/${file}`;
    navigate(newUrl);

    return () => {
      abortController.abort();
      // Clean up the object URL to avoid memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, fileId]);

  return (
        <iframe
          title="PDF Viewer"
          src={fileUrl}
          style={{ width: '100%', height: '100vh'}}
        />
  );
}

export default ViewPdf;
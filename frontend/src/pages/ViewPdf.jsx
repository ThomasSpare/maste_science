import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewPdf.css';

const ViewPdf = () => {
  const { file, fileId } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("Params:", { file, fileId });
    if (!file) {
      console.error("File parameter is undefined.");
      return;
    }
    const serverAddress = 'http://localhost:8000';
    const url = `${serverAddress}/api/uploads/${file}`;

    setIsLoading(true); // Set isLoading to true before fetching

    fetch(url, { signal })
      .then(response => response.blob())
      .then(blob => {
        const pdfFile = new File([blob], `${file}.pdf`, { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(pdfFile);
        setFileUrl(objectUrl);
        setIsLoading(false); // Set isLoading to false after fetching
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
        setIsLoading(false); // Set isLoading to false on error
      });

    const newUrl = `/view-pdf/${fileId}/${file}`;
    navigate(newUrl);

    return () => {
      abortController.abort();
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, fileId]);

  return (
    <>
      {isLoading ? ( // Render loader while isLoading is true
        <div className="loader">Loading...</div>
      ) : (
        <iframe
          title="PDF Viewer"
          src={fileUrl}
          style={{ width: '100%', height: '100vh' }}
          frameBorder={0}
        ></iframe>
      )}
    </>
  );
};

export default ViewPdf;
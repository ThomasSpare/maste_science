import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { saveAs } from 'file-saver';
import { CdsButton } from '@cds/react/button';


const ViewImg = () => {
    const { fileId, fileKey } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [imageSrc, setImageSrc] = useState('');
    useAuth0(); // Ensure this path is correct

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchData = async () => {

        if (!fileKey) {
            console.error("File parameter is undefined.");
            return;
        }
        const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
              scope: "read:files",
            },
          });
        const serverAddress = process.env.REACT_APP_API_BASE_URL; // Update this to your server address
        const url = `${serverAddress}/api/uploads/${fileKey}`;
            const response = await fetch(url, { 
                signal,
                headers: {
                  Authorization: `Bearer ${token}` // Include the token in headers
                }
              });
      
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              
              const imageBlob = await response.blob();
              const imageObjectURL = URL.createObjectURL(imageBlob);
              setImageSrc(imageObjectURL);
        };

        fetchData();

        return () => {
            abortController.abort();
        };
    }, [fileKey, fileId]); // Add fileKey to the dependency array

    const handleDownload = () => {
        fetch(imageSrc)
            .then(response => response.blob())
            .then(blob => {
                saveAs(blob, 'image.png'); // Change the file name and extension as needed
            });
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {imageSrc ? <img src={imageSrc} alt="Fetched content" style={{ maxWidth: '100%' }} /> : <p>Loading...</p>}
            <CdsButton className="clr-button" onClick={handleDownload} style={{ marginTop: '20px' }}>Download</CdsButton>
        </div>
    );
}

export default ViewImg;
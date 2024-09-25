import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { saveAs } from 'file-saver';

const ViewImg = () => {
    const { fileId, fileKey } = useParams();
    const [imageSrc, setImageSrc] = useState('');
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
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
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
        };
    }, [fileKey]); // Add fileKey to the dependency array

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
            <button onClick={handleDownload} style={{ marginTop: '20px' }}>Download</button>
        </div>
    );
}

export default ViewImg;
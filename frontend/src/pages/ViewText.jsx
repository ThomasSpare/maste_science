import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { saveAs } from 'file-saver';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

const ViewText = () => {
    const { fileId, fileKey } = useParams();
    const [fileContent, setFileContent] = useState('');
    const [fileType, setFileType] = useState('');
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
                const contentType = response.headers.get('Content-Type');
                setFileType(contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : contentType.split('/')[1]);
                return response.blob();
            })
            .then(blob => {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const content = e.target.result;
                    setFileContent(content);
                };
                if (blob.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || blob.type === 'application/msword') {
                    fileReader.readAsArrayBuffer(blob);
                } else {
                    fileReader.readAsText(blob);
                }
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
    }, [fileKey, fileId]); // Add fileKey to the dependency array

    const renderContent = () => {
        if (fileContent) {
            const docs = [
                {
                    uri: URL.createObjectURL(new Blob([fileContent], { type: fileType })),
                    fileType: fileType // Use the fileType state directly
                }
            ];
            return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
        } else {
            return <p>Loading...</p>;
        }
    };

    const handleDownload = () => {
        const blob = new Blob([fileContent], { type: fileType });
        const fileName = fileKey.split('/').pop();
        saveAs(blob, fileName);
    };

    return (
        <div style={{ padding: '20px', whiteSpace: 'pre-wrap' }}>
            {renderContent()}
            <button onClick={handleDownload}>Download</button>
        </div>
    );
}

export default ViewText;
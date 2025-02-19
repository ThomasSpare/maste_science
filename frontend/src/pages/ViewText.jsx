import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { saveAs } from 'file-saver';

const ViewText = () => {
    const { fileId, fileKey } = useParams();
    const [fileContent, setFileContent] = useState('');
    const [fileType, setFileType] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchFile = async () => {
            if (!fileKey) {
                setError("File parameter is undefined.");
                setLoading(false);
                return;
            }

            const serverAddress = process.env.REACT_APP_API_BASE_URL;
            const url = `${serverAddress}/api/uploads/${fileKey}`;
            
            setFileName(fileKey.split('/').pop());

            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                      scope: "read:files read:folders delete:files",  // Add all required scopes
                    },
                  });
                const response = await fetch(url, {
                    signal,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const contentType = response.headers.get('Content-Type');
                setFileType(contentType);
                const blob = await response.blob();

                // Only read content for text files
                if (blob.type.startsWith('text/') || blob.type === 'application/json') {
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        setFileContent(e.target.result);
                        setLoading(false);
                    };
                    fileReader.onerror = () => {
                        setError("Failed to read file");
                        setLoading(false);
                    };
                    fileReader.readAsText(blob);
                } else {
                    // For non-text files, just store the blob
                    setFileContent(blob);
                    setLoading(false);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(`Error loading file: ${error.message}`);
                    setLoading(false);
                }
            }
        };

        fetchFile();

        return () => {
            abortController.abort();
        };
    }, [fileKey, fileId, getAccessTokenSilently]);

    const handleDownload = () => {
        if (fileContent instanceof Blob) {
            saveAs(fileContent, fileName);
        } else {
            const blob = new Blob([fileContent], { type: fileType });
            saveAs(blob, fileName);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    // For non-text files, show download prompt
    if (fileContent instanceof Blob) {
        return (
            <div className="p-8 text-center" style={{ marginTop: '10vh' }}>
            <p className="mb-4">This file type cannot be previewed directly.</p>
            <button 
                onClick={handleDownload}
                className="px-4 py-2" 
                style={{ backgroundColor: '#6cadef', color: 'white' }}
            >
                Download {fileName}
            </button>
            </div>
        );
    }

    // For text files, show content
    return (
        <div className="p-8">
            <pre className="whitespace-pre-wrap break-words p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-[80vh] overflow-auto font-mono text-sm">
                {fileContent}
            </pre>
            <button 
                onClick={handleDownload}
                className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
            >
                Download
            </button>
        </div>
    );
};

export default ViewText;
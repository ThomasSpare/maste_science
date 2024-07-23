import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { PDFRenderer } from '@cyntler/react-doc-viewer';
import "@cyntler/react-doc-viewer/dist/index.css";


const ViewPdf = () => {
  const { file } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  useEffect(() => {
    if (!file) {
      console.error("File parameter is undefined.");
      setIsLoading(false);
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    const serverAddress = 'http://localhost:8000';
    const url = `${serverAddress}/api/uploads/${file}`;

    setIsLoading(true);

    fetch(url, { signal })
      .then(response => response.blob())
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        setDocs([{ uri: objectURL, fileType: 'pdf' }]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setIsLoading(false);
      });

    return () => {
      abortController.abort();
      // Cleanup created object URLs
      docs.forEach(doc => URL.revokeObjectURL(doc.uri));
      uploadedDocs.forEach(doc => URL.revokeObjectURL(doc.uri));
    };
  }, [file]);

  const handleFileChange = (event) => {
    if (event.target.files?.length) {
      const filesArray = Array.from(event.target.files);
      const objectURLs = filesArray.map(file => ({
        uri: window.URL.createObjectURL(file),
        fileName: file.name,
      }));
      setUploadedDocs(objectURLs);
    }
  };

  return (
    <div id="ViewPdf">
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />
      <DocViewer
        documents={uploadedDocs.length > 0 ? uploadedDocs : docs}
        pluginRenderers={PDFRenderer}
      />
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default ViewPdf;
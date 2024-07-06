import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { PDFRenderer, HTMLRenderer } from "react-doc-viewer";


const ViewPdf = () => {
  // Assuming `fileId` or `filePath` is passed as a prop or via route parameters
    const { fileId } = useParams();
    const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    // Construct the URL to fetch the file
    const url = `/api/uploads/:fileId`;

    // Update the state with the URL for the file
    setFileUrl(url);
  }, [fileUrl, fileId]);

  const docs = [
    { uri: fileUrl }
  ];

  return (
    
      <DocViewer 
      pluginRenderers={[PDFRenderer, HTMLRenderer]}
      documents={docs}
      config={{
        header: {
            retainURLParams: true,

            },   
       } } />

    );
}



export default ViewPdf;
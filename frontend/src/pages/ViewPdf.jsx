import React, { useEffect, useState } from 'react';
import DocViewer, { PDFRenderer } from "react-doc-viewer";

function ViewPdf() {
    const [docs, setDocs] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFile = JSON.parse(decodeURIComponent(urlParams.get('file')));

    useEffect(() => {
        // Assuming you have a state variable named 'selectedFile' that holds the selected file from the Search component
        if (selectedFile) {
            const document = { uri: selectedFile.filepath };
            setDocs([document]);
        }
    }, [selectedFile]);

    return (
        <div>
            {docs.length > 0 ? (
                <DocViewer
                    className="DocViewer"
                    documents={docs}
                    pluginRenderers={[PDFRenderer]}
                />
            ) : (
                <p>No file selected.</p>
            )}
        </div>
    );
}

export default ViewPdf;

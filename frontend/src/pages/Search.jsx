import React, { useEffect, useState } from 'react';
import DocViewer, { PDFRenderer, PNGRenderer, HTMLRenderer } from "react-doc-viewer";

function Search() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/uploads')  // Viktigt att ändra till rätt port 8000
      .then(response => response.json())
      .then(data => {
        const documents = data.map(doc => ({ uri: doc.filepath }));
        setDocs(documents);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <DocViewer 
      className="DocViewer"
      documents={docs}
      theme={{
        primary: "#5296d8",
        secondary: "#ffffff",
        tertiary: "#5296d899",
        text_primary: "#ffffff",
        text_secondary: "#5296d8",
        text_tertiary: "#00000099",
        disableThemeScrollbar: false,
      }}
      pluginRenderers={[PDFRenderer, PNGRenderer, HTMLRenderer]}
    />
  );
}

export default Search;
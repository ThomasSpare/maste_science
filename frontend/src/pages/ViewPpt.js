import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PptxGenJS from "pptxgenjs";

const ViewPpt = () => {
  const { fileId, fileKey } = useParams();
  const [fileContent, setFileContent] = useState(null);
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        setFileContent(arrayBuffer);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [fileKey, fileId]); // Add fileKey and fileId to the dependency array

  const renderContent = () => {
    if (fileContent) {
      const pptx = new PptxGenJS();
      pptx.load(fileContent);
      const slides = pptx.getSlides();
      return slides.map((slide, index) => (
        <div key={index}>
          {slide.getElements().map((element, elemIndex) => (
            <div key={elemIndex}>
              {element.type === "text" && <p>{element.text}</p>}
              {element.type === "image" && (
                <img src={element.data} alt="slide" />
              )}
            </div>
          ))}
        </div>
      ));
    } else {
      return <div>Loading...</div>;
    }
  };

  return (
    <div style={{ padding: "20px", whiteSpace: "pre-wrap" }}>
      {renderContent()}
    </div>
  );
};

export default ViewPpt;

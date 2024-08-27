import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Ensure this path is correct

const ViewPpt = () => {
  const { file, fileId } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState("");
  useAuth(); // Ensure this path is correct

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("Params:", { file, fileId });
    if (!file) {
      console.error("File parameter is undefined.");
      return;
    }
    const serverAddress = "http://localhost:8000";
    const url = `${serverAddress}/ppt/${file}`;

    fetch(url, { signal })
      .then((response) => response.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error);
        }
      });

    const newUrl = `/view-ppt/${fileId}/${file}`;
    navigate(newUrl);

    return () => {
      abortController.abort();
      // Clean up the object URL to avoid memory leaks
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, fileId]);

  return (
    <iframe
      title="PPT Viewer"
      src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default ViewPpt;

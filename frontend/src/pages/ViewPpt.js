import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Ensure this path is correct

const ViewPpt = () => {
  const { fileId, fileKey } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  useAuth0(); // Ensure this path is correct

  useEffect(() => {
    console.log("Params:", { fileId, fileKey });
    if (!fileKey) {
      console.error("File parameter is undefined.");
      return;
    }
    const serverAddress = process.env.REACT_APP_API_BASE_URL; // Update this to your server address
    const url = `${serverAddress}/api/uploads/${fileKey}`;

    setFileUrl(url);
  }, [fileKey]);

  const apiKey = "AIzaSyAfPJ2vUMgwsbVLtr9uz4nP55l4AZNMfYA";

  return (
    <iframe
      title="PPT Viewer"
      src={`https://docs.google.com/gview?key=${apiKey}&embedded=true&url=${fileUrl}`}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};

export default ViewPpt;

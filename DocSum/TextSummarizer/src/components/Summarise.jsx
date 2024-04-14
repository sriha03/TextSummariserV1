import React, { useState } from 'react';
import axios from 'axios';

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    try {
      // Create FormData object and append the selected file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make a POST request to the server
      const response = await axios.post('http://localhost:5298/DocSum/uploadpdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.summaries);

      // Update upload status based on the response
      setUploadStatus('File uploaded successfully');
    } catch (error) {
      // Handle error if upload fails
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploadComponent;
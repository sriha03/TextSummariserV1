import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [summaries, setSummaries] = useState('');

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload and summarize
  const handleFileUpload = async () => {
    try {
      // Check if a file is selected
      if (!selectedFile) {
        setUploadStatus('Please select a file');
        return;
      }

      // Create FormData object and append the selected file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make a POST request to the server
      const response = await axios.post('http://localhost:5298/DocSum/uploadpdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update upload status based on the response
      setUploadStatus('File uploaded successfully');

      // Set the summaries received from the server to the state
      setSummaries(response.data.summaries);
    } catch (error) {
      // Handle error if upload fails
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file');
    }
  };

  return (
    <>
      <header className="flex h-16 w-full shrink-0 items-center px-4 md:px-6 bg-gray-100 dark:bg-gray-900 mb-4">
        <h1 className="text-lg font-semibold mx-auto">Text Summarizer</h1>
      </header>
      <div className="grid w-full max-w-100 gap-6 px-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Input section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
            <div className="grid gap-2 p-4">
              <h2 className="text-lg font-medium">Input</h2>
              <div className="flex flex-col h-[200px]">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 dark:text-blue-400"
                >
                  Choose a file
                </label>
              </div>
            </div>
          </div>
          {/* Upload document section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
            <div className="grid gap-2 p-4">
              <h2 className="text-lg font-medium">Upload Document</h2>
              <div className="flex flex-col items-center justify-center h-[150px] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <button
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  onClick={handleFileUpload}
                >
                  Upload and Summarize
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Preferences section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
          <div className="grid gap-2 p-4">
            <h2 className="text-lg font-medium">Preferences</h2>
            <div className="flex flex-col h-[50px]">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 resize-none"
                placeholder="Enter your preferences here."
                type="text"
                style={{ height: '50px' }}
              />
            </div>
          </div>
        </div>
        {/* Output section */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
          <div className="grid gap-2 p-4">
            <h2 className="text-lg font-medium">Output</h2>
            <div className="flex flex-col h-[300px]">
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 resize-none"
                placeholder="Your summarized text will appear here."
                readOnly
                value={summaries} // Display summaries data in textarea
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
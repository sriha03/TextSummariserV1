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
            <header className="header flex h-16 w-full items-center px-4 md:px-6 bg-gray-100 dark:bg-gray-900 mb-4">
                <h1 className="text-lg font-semibold mx-auto">Text Summarizer</h1>
            </header>
            <main className="main grid grid-cols-2 gap-4 px-4">
                <section className="input rounded-lg border border-gray-200 dark:border-gray-800 w-full">
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
                </section>
                <section className="upload rounded-lg border border-gray-200 dark:border-gray-800 w-full">
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
                </section>
            </main>
            <section className="output rounded-lg border border-gray-200 dark:border-gray-800 w-full mt-4">
                <div className="grid gap-2 p-4">
                    <h2 className="text-lg font-medium">Output</h2>
                    <div className="flex flex-col h-[300px]">
                        <textarea
                            style={{
                                backgroundColor: '#f0f0f0', // Light gray background
                                borderRadius: '0.5rem', // Rounded corners
                                border: '1px solid #ccc', // Consistent border
                                padding: '8px', // Add some padding
                                resize: 'none', // Disable resizing
                                minHeight: '80px', // Minimum height for better layout
                                flex: 1, // Occupy remaining space
                            }}

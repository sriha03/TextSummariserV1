/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { PiNotePencilFill } from "react-icons/pi";

function GoogleDocsViewer({ fileUrl }) {
    return (
        <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            width="100%"
            height="350px"
            title="Google Docs Viewer"
        />
    );
}

function Home() {
    const [fileURL, setFileURL] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [summaries, setSummaries] = useState('');
    const [allConversations, setAllConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [preference, setPreference] = useState('short'); 

    const handleSelectConv = (id) => {
        axios.post(`https://localhost:7103/DocSum/GetConverstion?id=${id}`, {
            headers: {
                'Accept': 'text/plain'
            }
        })
        .then(response => {
            console.log(response.data);
            setSelectedConversation(response.data);
            setPreference('short');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    const handleFileChange = (event) => {
        var file = event.target.files[0];
        setSelectedFile(file);
        setFileURL(URL.createObjectURL(file));
    };

    const handleFileUpload = async () => {
        try {
            if (!selectedFile) {
                setUploadStatus('Please select a file');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            const response2 = await axios.post('http://localhost:5000/summarize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response2.data);
            const summary=response2.data
            formData.append('original_summary', summary.original_summary);
            formData.append('further_summary', summary.further_summary);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            const response = await axios.post('http://localhost:5298/DocSum/NewChat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSelectedConversation(response.data)
            console.log(response.data)
            setUploadStatus('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Failed to upload file');
        }
    };

    useEffect(() => {
        axios.post('http://localhost:5298/DocSum/GetAllConversation', {
            headers: {
                'Accept': 'text/plain'
            }
        })
        .then(response => {
            console.log(response);
            setAllConversations(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
    }, [selectedConversation]);

    return (
        <>
            <header className="flex h-16 w-full items-center px-4 md:px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-4">
                <h1 className="text-lg font-semibold mx-auto text-white">Text Summarizer</h1>
            </header>
            <div className="flex">
                <div className="bg-gray-100 dark:bg-gray-900 w-[300px] h-screen overflow-y-auto">
                    <div className='flex flex-col bg-gray-100 dark:bg-gray-90'>
                        <h2 className='p-4 text-lg font-medium'>Conversations</h2>
                        <button className={`flex hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-full ${selectedConversation === null ? 'bg-gray-200' : ''}`} onClick={() => setSelectedConversation(null)}>
                            New Chat  &nbsp;
                            <PiNotePencilFill size={24} className="text-blue-600 dark:text-blue-400" />
                        </button>
                    </div>
                    {allConversations.map(item => (
                        <button className={`p-4 block w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full ${selectedConversation?.id === item.id ? 'bg-gray-200' : ''}`} key={item.id} onClick={() => handleSelectConv(item.id)}>
                            {item.blob.fileName}
                        </button>
                    ))}
                </div>
                <div className="grid w-full max-w-full gap-6 px-4 h-[400px]">
                    <div className={`grid gap-6 h-[200px] ${selectedConversation === null ? 'grid-cols-2' : 'grid-cols-1' }`}>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
                            <div className="grid gap-2 p-4">
                                <h2 className="text-lg font-medium">Input</h2>
                                <div className="flex flex-col h-[150px] items-center justify-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                    />
                                    {selectedConversation !== null ? (
                                        <>
                                            <GoogleDocsViewer fileUrl={selectedConversation.blob.uri} />
                                        </>
                                    ) : (
                                        <>
                                            {selectedFile ? (
                                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                                    <Viewer fileUrl={fileURL} />
                                                </Worker>
                                            ) : (
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                                    onClick={() => document.getElementById('file-upload').click()}
                                                >
                                                    Choose a file
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {selectedConversation === null && (
                            <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
                                <div className="grid gap-2 p-4">
                                    <h2 className="text-lg font-medium">Upload Document</h2>
                                    <div className="flex flex-col items-center justify-center h-[150px] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            onClick={handleFileUpload}
                                        >
                                            Upload and Summarize
                                        </button>
                                        {uploadStatus && (
                                            <p className="mt-2 text-sm text-gray-500">{uploadStatus}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
                        <div className="grid gap-2 p-4">
                            <h2 className="text-lg font-medium text-center">Preferences</h2>
                            <div className="flex flex-row row mb-2 text-center">
                                <label className="col w-[50%]">
                                    <input
                                        type="radio"
                                        name="preference"
                                        value="short"
                                        checked={preference === 'short'}
                                        onChange={(e) => setPreference(e.target.value)}
                                    /> &nbsp;
                                    Short
                                </label>
                                <label className="w-[50%] col">
                                    <input
                                        type="radio"
                                        name="preference"
                                        value="long"
                                        checked={preference === 'long'}
                                        onChange={(e) => setPreference(e.target.value)}
                                    /> &nbsp;
                                    Long
                                </label>
                            </div>
                        </div>
                    </div>
                    {selectedConversation !== null && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 w-full">
                            <div className="grid gap-2 p-4">
                                <h2 className="text-lg font-medium">Summary</h2>
                                <div className="flex flex-col h-[300px]">
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 resize-none"
                                        placeholder="Your summarized text will appear here."
                                        readOnly
                                        value={selectedConversation.summaries.original_summary}
                                    ></textarea>
                                </div>
                                <h2 className={`${preference === 'short' ? 'hidden' : ''} text-lg font-medium`}>Further Summary</h2>
                                <div className="flex flex-col h-[300px]">
                                    <textarea
                                        className={`${preference === 'short' ? 'hidden' : ''} flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 resize-none`}
                                        placeholder="Your summarized text will appear here."
                                        readOnly
                                        value={selectedConversation.summaries.further_summary}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;

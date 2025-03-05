import React from 'react';
import AudioRecorder from './components/AudioRecorder';
import './App.css';

const App: React.FC = () => {
  const handleUpload = async (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);    
    try {
      const response = await fetch('here-we-can-put-the-endpoint-url-that-could-handle-the-upload-of-audio-records-into-database', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      console.log('Upload successful');
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Life Story Recording App</h1>
        <AudioRecorder onUpload={handleUpload} />
      </header>
    </div>
  );
};

export default App;

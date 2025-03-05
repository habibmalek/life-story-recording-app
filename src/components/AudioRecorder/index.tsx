import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

interface AudioRecorderProps {
  onUpload: (audioFile: File) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUpload }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setRecording(true);
      setError(null);
    } catch (err) {
      setError('Microphone access required for recording');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleUpload = () => {
    if (audioUrl) {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'recording.webm', {
        type: 'audio/webm'
      });
      onUpload(audioFile);
    }
  };

  return (
    <div className="audio-recorder">
      <h2>Audio Recorder</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="controls">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`record-button ${recording ? 'recording' : ''}`}
        >
          {recording ? '⏹ Stop Recording' : '⏺ Start Recording'}
        </button>

        {audioUrl && (
          <button onClick={handleUpload} className="upload-button">
            Upload Recording
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="audio-preview">
          <audio controls src={audioUrl}>
            Your browser does not support audio playback
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;

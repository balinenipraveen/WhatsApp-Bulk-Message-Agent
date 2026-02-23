import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileUpload, accept, label, icon = "📄" }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  return (
    <div className="file-uploader">
      <label className="upload-label">{label}</label>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <span className="icon">{icon}</span>
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag & drop file here, or click to select</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;


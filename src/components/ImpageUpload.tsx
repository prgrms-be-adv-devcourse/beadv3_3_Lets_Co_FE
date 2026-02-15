import React, { useState, useEffect, type ChangeEvent } from 'react';

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesSelected }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      const filesArray = Array.from(fileList);
      
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
      onFilesSelected(filesArray);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {previews.map((src, i) => (
          <img key={i} src={src} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
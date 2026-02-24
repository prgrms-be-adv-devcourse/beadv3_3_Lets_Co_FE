import React, { useState, type ChangeEvent, type DragEvent } from 'react';

interface ImageUploadProps {
    onFilesSelected: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesSelected }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const processFiles = (newFilesArray: File[]) => {
        const imageFiles = newFilesArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) return;

        const updatedFiles = [...files, ...imageFiles];
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    // 이미지 개별 삭제 함수
    const handleRemoveImage = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, i) => i !== indexToRemove);
        const updatedPreviews = previews.filter((_, i) => i !== indexToRemove);
        
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onFilesSelected(updatedFiles);
    };

    // 드래그 앤 드롭 이벤트 핸들러
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className="w-full space-y-6">
            
            {/* 1. 크게 늘린 드래그 앤 드롭 존 */}
            <label
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 
                    ${isDragging 
                        ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                    }`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                    <svg 
                        className={`w-12 h-12 mb-3 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                        <span className="text-blue-600">클릭하여 업로드</span>하거나 이미지를 여기로 크게 드래그하세요
                    </p>
                    <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG, GIF (여러 장 선택 및 추가 가능)
                    </p>
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
            </label>

            {/* 2. 업로드된 이미지 미리보기 그리드 */}
            {previews.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        등록된 이미지 <span className="text-blue-600 font-semibold text-xs bg-blue-50 px-2 py-0.5 rounded-full">{previews.length}장</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previews.map((src, i) => (
                            <div 
                                key={i} 
                                className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white group"
                            >
                                <img 
                                    src={src} 
                                    alt={`preview-${i}`} 
                                    className="w-full h-full object-cover" 
                                />
                                
                                {/* 삭제(X) 버튼 - 마우스를 올렸을 때만 표시됨 */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    title="이미지 삭제"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default ImageUpload;
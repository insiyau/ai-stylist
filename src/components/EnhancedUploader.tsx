'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedUploaderProps {
    onSubmit?: (formData: FormData) => Promise<void>;
}

export default function EnhancedUploader({ onSubmit }: EnhancedUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles = Array.from(selectedFiles);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleRemoveFiles = () => {
        setFiles([]);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        if (onSubmit) {
            await onSubmit(formData);
        } else {
            // Fallback if no onSubmit provided
            try {
                const response = await fetch('/api/style-suggestions', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to get style suggestions');
                }

                const data = await response.json();
                console.log('Style suggestions:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl mx-auto"
        >
            <motion.div
                whileHover={{ scale: isDragging ? 1 : 1.01 }}
                animate={{
                    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)',
                    backgroundColor: isDragging ? 'rgba(239, 246, 255, 0.7)' : 'rgba(239, 246, 255, 0)'
                }}
                transition={{ duration: 0.2 }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer overflow-hidden shadow-sm`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                    accept="image/*"
                    multiple
                />

                <motion.div
                    className="flex flex-col items-center justify-center space-y-3"
                    animate={{ y: isDragging ? -10 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    {files.length > 0 ? (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-2"
                        >
                            <div className="flex flex-col items-center">
                                <svg
                                    className="w-8 h-8 mb-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
                                </svg>
                                <span className="text-sm font-bold">{files.length}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{
                                scale: isDragging ? 1.1 : 1,
                                rotate: isDragging ? [0, -10, 10, -10, 0] : 0
                            }}
                            transition={{
                                duration: 0.6,
                                type: 'spring',
                                stiffness: 200,
                                rotate: {
                                    type: 'tween',
                                    duration: 0.6
                                }
                            }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-2"
                        >
                            <svg
                                className="w-10 h-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                        </motion.div>
                    )}

                    <h3 className="text-xl font-semibold text-gray-800">
                        {files.length > 0
                            ? `${files.length} file${files.length > 1 ? 's' : ''} ready to analyze`
                            : isDragging
                                ? 'Drop your images here!'
                                : 'Upload your clothing items'
                        }
                    </h3>

                    <p className="text-gray-500 max-w-md mx-auto">
                        {files.length > 0
                            ? 'Click to add more files or click the button below to get style recommendations'
                            : 'Upload images of your clothing, accessories, or outfits to get personalized style recommendations'
                        }
                    </p>

                    {files.length > 0 ? (
                        <div className="flex gap-3 mt-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFiles();
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-medium shadow-sm hover:bg-gray-300 transition-all"
                            >
                                Clear
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubmit();
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Get Style Suggestions
                            </motion.button>
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Browse Files
                        </motion.button>
                    )}

                    {files.length === 0 && (
                        <p className="text-xs text-blue-500 mt-3 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                            </svg>
                            Your privacy matters: Images are processed in-memory only and never stored
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
} 
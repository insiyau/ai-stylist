'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EnhancedUploader from './EnhancedUploader';
import EnhancedResults from './EnhancedResults';
import { StyleSuggestion } from '@/types';

export default function EnhancedStylistApp() {
    const [styleSuggestions, setStyleSuggestions] = useState<StyleSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [firstUploadedImage, setFirstUploadedImage] = useState<File | null>(null);

    const handleGetStyleSuggestions = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);
        setStyleSuggestions(null); // Clear previous suggestions
        setFirstUploadedImage(null); // Clear previous image

        const images = formData.getAll('images');
        if (images.length > 0 && images[0] instanceof File) {
            setFirstUploadedImage(images[0] as File);
        } else {
            // Handle case where no valid image is uploaded if necessary, 
            // or rely on API to return error for no images.
            // For now, we just won't set an image for visualization.
            console.warn('[EnhancedStylistApp] No file found in formData to set as firstUploadedImage.');
        }

        try {
            const response = await fetch('/api/style-suggestions', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to get style suggestions');
            }

            const data = await response.json();

            // Debug the API response
            console.log('API Response:', data);

            // Check if suggestions property exists
            if (!data || !data.suggestions) {
                console.error('API response missing suggestions property:', data);
                throw new Error('Invalid API response structure');
            }

            // The response structure might vary - handle both direct object and nested structures
            const suggestionsData = typeof data.suggestions === 'object' ? data.suggestions : data;

            console.log('Suggestions data structure:', suggestionsData);

            // Create a validated object with default values for missing properties
            const validatedSuggestions: StyleSuggestion = {
                outfitIdeas: suggestionsData.outfitIdeas || [],
                colorMatching: suggestionsData.colorMatching || {
                    complementaryColors: [],
                    avoidColors: []
                },
                seasonalRecommendations: suggestionsData.seasonalRecommendations || {
                    spring: '',
                    summer: '',
                    fall: '',
                    winter: ''
                },
                moodBoards: suggestionsData.moodBoards || []
            };

            console.log('Validated suggestions:', validatedSuggestions);

            if (!validatedSuggestions.outfitIdeas || !Array.isArray(validatedSuggestions.outfitIdeas)) {
                console.error('Missing or invalid outfitIdeas:', validatedSuggestions.outfitIdeas);
                validatedSuggestions.outfitIdeas = [{
                    title: "Default Outfit",
                    description: "We couldn't process your images properly, but here's a general suggestion",
                    items: ["Try a classic white shirt", "Pair with dark jeans", "Add minimal accessories"]
                }];
            }

            setStyleSuggestions(validatedSuggestions);
        } catch (error) {
            console.error('Error processing style suggestions:', error);
            setError('Something went wrong while getting style suggestions. Please try again.');
            setStyleSuggestions(null);
            setFirstUploadedImage(null); // Also clear image on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {!styleSuggestions && !isLoading && (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                                <h2 className="text-2xl font-bold mb-2">Upload Your Items</h2>
                                <p className="text-blue-100">
                                    Get personalized style recommendations based on your clothing
                                </p>
                            </div>
                            <div className="p-6">
                                <EnhancedUploader onSubmit={handleGetStyleSuggestions} />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm"
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                            </svg>
                                            {error}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
                            <div className="w-20 h-20 border-blue-500 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-medium text-gray-900 mb-1">Analyzing your style...</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                Our AI is processing your images to create personalized style recommendations
                            </p>
                        </div>
                    </motion.div>
                )}

                {styleSuggestions && !isLoading && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <EnhancedResults suggestions={styleSuggestions} firstUploadedImage={firstUploadedImage} />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 text-center"
                        >
                            <button
                                onClick={() => {
                                    setStyleSuggestions(null);
                                    setFirstUploadedImage(null); // Clear image when starting over
                                }}
                                className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                Upload New Images
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 
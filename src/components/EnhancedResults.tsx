'use client';

import { motion } from 'framer-motion';
import { StyleSuggestion } from '@/types';

interface EnhancedResultsProps {
    suggestions: StyleSuggestion | null;
}

export default function EnhancedResults({ suggestions }: EnhancedResultsProps) {
    if (!suggestions) return null;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            <div className="p-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-6 text-white">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-2xl font-bold mb-2"
                    >
                        Your Style Recommendations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-blue-100"
                    >
                        Personalized outfit ideas based on your uploaded items
                    </motion.p>
                </div>

                <div className="p-6 md:p-8">
                    {/* Outfit Ideas Section */}
                    <motion.section
                        variants={staggerContainer}
                        className="mb-10"
                    >
                        <motion.h3
                            variants={fadeInUp}
                            className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2 pb-2 border-b"
                        >
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            Outfit Ideas
                        </motion.h3>

                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {suggestions.outfitIdeas.map((outfit, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                    className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4 mb-4">
                                        <h4 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {outfit.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm mt-1">{outfit.description}</p>
                                    </div>

                                    <ul className="space-y-2">
                                        {outfit.items.map((item, itemIndex) => (
                                            <motion.li
                                                key={itemIndex}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * itemIndex }}
                                                className="flex items-start text-gray-700 text-sm"
                                            >
                                                <span className="text-blue-500 mr-2 mt-0.5 flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                </span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.section>

                    {/* Color Matching Section */}
                    <motion.section
                        variants={staggerContainer}
                        className="mb-10"
                    >
                        <motion.h3
                            variants={fadeInUp}
                            className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2 pb-2 border-b"
                        >
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                            </svg>
                            Color Matching
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                variants={fadeInUp}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6"
                            >
                                <h4 className="text-md font-medium text-blue-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    Complementary Colors
                                </h4>

                                <div className="flex flex-wrap gap-3">
                                    {suggestions.colorMatching.complementaryColors.map((color, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div
                                                className="w-14 h-14 rounded-full border-2 border-white shadow-md"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                            <span className="text-xs font-medium text-gray-600 mt-2">{color}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6"
                            >
                                <h4 className="text-md font-medium text-red-700 mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                    </svg>
                                    Colors to Avoid
                                </h4>

                                <div className="flex flex-wrap gap-3">
                                    {suggestions.colorMatching.avoidColors.map((color, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="relative">
                                                <div
                                                    className="w-14 h-14 rounded-full border-2 border-white shadow-md opacity-70"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 mt-2">{color}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Seasonal Recommendations */}
                    <motion.section
                        variants={staggerContainer}
                    >
                        <motion.h3
                            variants={fadeInUp}
                            className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2 pb-2 border-b"
                        >
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            Seasonal Styling
                        </motion.h3>

                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {Object.entries(suggestions.seasonalRecommendations).map(([season, recommendation]) => {
                                const seasonIcons = {
                                    spring: (
                                        <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd"></path>
                                            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
                                        </svg>
                                    ),
                                    summer: (
                                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                                        </svg>
                                    ),
                                    fall: (
                                        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z"></path>
                                            <path d="M5.22 14.78c-2.51-5.41-2.51-9.78 0-12.8.77-.8 5.08-.8 5.78 0 .7.8 4.74.8 5.78 0 2.51 3.02 2.51 7.39 0 12.8-1.95 4.2-3.73 5.21-5.78 5.22-2.05 0-3.83-1.01-5.78-5.22z"></path>
                                        </svg>
                                    ),
                                    winter: (
                                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.107 2.995a.75.75 0 01.536-.17l4.18.61a.75.75 0 01-.214 1.485l-2.94-.428 1.53 1.273a.75.75 0 11-.961 1.153L2.96 5.05l-.36 2.17a.75.75 0 01-1.485-.246l.51-3.08a.75.75 0 01.284-.446l.732-.527.466-.586zM6.358 6.75a.75.75 0 01.926.522.756.756 0 01-.007.152l-.1.477 1.5.375a.75.75 0 01-.368 1.454l-2.25-.563a.752.752 0 01-.269-.14.75.75 0 01-.375-.926l.943-3.772a.75.75 0 011.45.362L6.358 6.75zm7.25 3.723a.75.75 0 01.536-.713l3.773-.944a.75.75 0 11.366 1.45l-2.066.517.657 1.169a.75.75 0 11-1.308.737l-1.2-2.137a.744.744 0 01-.091-.268.75.75 0 01.231-.808l.002-.003zm-1.41-2.266a.75.75 0 01.671-.822l4.18-.606a.75.75 0 11.214 1.486l-2.94.427 1.53 1.272a.75.75 0 01-.961 1.153l-2.27-1.892a.749.749 0 01-.256-.464l-.167-1-.6.5.599-.554z"></path>
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-10a2 2 0 110 4 2 2 0 010-4z" clipRule="evenodd"></path>
                                        </svg>
                                    )
                                };

                                const seasonColors = {
                                    spring: 'from-pink-50 to-pink-100 text-pink-800',
                                    summer: 'from-yellow-50 to-yellow-100 text-yellow-800',
                                    fall: 'from-orange-50 to-orange-100 text-orange-800',
                                    winter: 'from-blue-50 to-blue-100 text-blue-800'
                                };

                                return (
                                    <motion.div
                                        key={season}
                                        variants={fadeInUp}
                                        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                        className={`bg-gradient-to-br ${seasonColors[season as keyof typeof seasonColors]} rounded-xl p-5 shadow-sm`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            {seasonIcons[season as keyof typeof seasonIcons]}
                                            <h4 className="text-lg font-medium capitalize">{season}</h4>
                                        </div>
                                        <p className="text-gray-700 text-sm">{recommendation}</p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.section>
                </div>

                <div className="text-center pb-8 px-6">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-gray-500"
                    >
                        Remember that personal style is all about expressing yourself. These are just suggestions to inspire you!
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
} 
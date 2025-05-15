import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { StyleSuggestion } from '@/types';
import fs from 'fs';
import path from 'path';

// Define the standardized API response format
interface StyleAPIResponse {
    success: boolean;
    suggestions: StyleSuggestion;
    error?: string;
    privacy_note: string;
}

// Default values for empty/missing data
const DEFAULT_OUTFIT_IDEA = {
    title: "Classic Versatile Look",
    description: "A timeless outfit that works for many occasions",
    items: [
        "Clean, minimal white or neutral top",
        "Well-fitted dark jeans or trousers",
        "Simple, quality footwear in a neutral color"
    ]
};

const DEFAULT_COLOR_MATCHING = {
    complementaryColors: ["#000000", "#FFFFFF", "#0073CF"],
    avoidColors: ["#FF5733", "#D1B000"]
};

const DEFAULT_SEASONAL_RECOMMENDATIONS = {
    spring: "Light layers and bright accents",
    summer: "Breathable fabrics and lighter colors",
    fall: "Earth tones and light jackets",
    winter: "Heavier layers and darker colors"
};

export async function POST(request: NextRequest) {
    try {
        // Process the FormData to get the uploaded images
        const formData = await request.formData();
        const images = formData.getAll('images');

        console.log(`[API] Received ${images.length} images for processing`);

        if (!images || images.length === 0) {
            return createStandardResponse(
                false,
                createDefaultStyleSuggestion(),
                "No images provided"
            );
        }

        // Check if API key is set
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('[API] Anthropic API key is not set');
            return createStandardResponse(
                false,
                createDefaultStyleSuggestion(),
                "Configuration error: API key not set"
            );
        }

        // Call Anthropic Claude API to analyze images and provide style recommendations
        console.log('[API] Calling Anthropic API for style suggestions');
        const styleSuggestions = await getLLMStyleSuggestions(images);

        // Log the Claude response for debugging
        console.log('[API] Claude response structure:',
            Object.keys(styleSuggestions),
            'Has outfitIdeas:', Boolean(styleSuggestions.outfitIdeas)
        );

        // Create a normalized response object
        const normalizedSuggestions = normalizeStyleSuggestions(styleSuggestions);

        // No more mood board generation

        return createStandardResponse(true, normalizedSuggestions);

    } catch (error: unknown) {
        console.error('[API] Error processing style suggestions:', error);
        return createStandardResponse(
            false,
            createDefaultStyleSuggestion(),
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
}

/**
 * Creates a standardized API response with consistent structure
 */
function createStandardResponse(
    success: boolean,
    suggestions: StyleSuggestion,
    error?: string
): NextResponse {
    const response: StyleAPIResponse = {
        success,
        suggestions,
        privacy_note: "Your images were only used for generating these suggestions and were not stored on our servers."
    };

    if (error) {
        response.error = error;
    }

    return NextResponse.json(response, {
        status: success ? 200 : 500
    });
}

/**
 * Creates a default style suggestion object for error cases
 */
function createDefaultStyleSuggestion(): StyleSuggestion {
    return {
        outfitIdeas: [
            { ...DEFAULT_OUTFIT_IDEA },
            {
                title: "Smart Casual",
                description: "Perfect for semi-formal occasions or office environments",
                items: [
                    "Button-down shirt in a neutral color",
                    "Chinos or dress pants",
                    "Leather shoes or clean sneakers"
                ]
            },
            {
                title: "Relaxed Weekend",
                description: "Comfortable yet put-together for casual outings",
                items: [
                    "Quality t-shirt or casual top",
                    "Well-fitted jeans or casual pants",
                    "Casual footwear suited to the season"
                ]
            }
        ],
        colorMatching: { ...DEFAULT_COLOR_MATCHING },
        seasonalRecommendations: { ...DEFAULT_SEASONAL_RECOMMENDATIONS },
        moodBoards: []
    };
}

/**
 * Normalizes the style suggestions to ensure consistent structure
 */
function normalizeStyleSuggestions(suggestions: StyleSuggestion | Record<string, unknown>): StyleSuggestion {
    // Create a base structure with defaults
    const normalized: StyleSuggestion = {
        outfitIdeas: [],
        colorMatching: { ...DEFAULT_COLOR_MATCHING },
        seasonalRecommendations: { ...DEFAULT_SEASONAL_RECOMMENDATIONS },
        moodBoards: []
    };

    // Process outfit ideas
    if (suggestions.outfitIdeas && Array.isArray(suggestions.outfitIdeas)) {
        normalized.outfitIdeas = suggestions.outfitIdeas.map((outfit: Record<string, unknown>) => ({
            title: typeof outfit.title === 'string' ? outfit.title : DEFAULT_OUTFIT_IDEA.title,
            description: typeof outfit.description === 'string' ? outfit.description : DEFAULT_OUTFIT_IDEA.description,
            items: Array.isArray(outfit.items) && outfit.items.length > 0
                ? outfit.items.filter((item): item is string => typeof item === 'string')
                : [...DEFAULT_OUTFIT_IDEA.items]
        }));
    } else {
        // If no valid outfit ideas, use defaults
        normalized.outfitIdeas = [
            { ...DEFAULT_OUTFIT_IDEA },
            {
                title: "Smart Casual",
                description: "Perfect for semi-formal occasions or office environments",
                items: [
                    "Button-down shirt in a neutral color",
                    "Chinos or dress pants",
                    "Leather shoes or clean sneakers"
                ]
            }
        ];
    }

    // Ensure we have at least one outfit idea
    if (normalized.outfitIdeas.length === 0) {
        normalized.outfitIdeas.push({ ...DEFAULT_OUTFIT_IDEA });
    }

    // Process color matching
    if (suggestions.colorMatching && typeof suggestions.colorMatching === 'object') {
        const colorMatching = suggestions.colorMatching as Record<string, unknown>;

        // Handle complementary colors
        if (colorMatching.complementaryColors &&
            Array.isArray(colorMatching.complementaryColors) &&
            colorMatching.complementaryColors.length > 0) {
            normalized.colorMatching.complementaryColors =
                colorMatching.complementaryColors.filter((color): color is string => typeof color === 'string');
        }

        // Handle avoid colors
        if (colorMatching.avoidColors &&
            Array.isArray(colorMatching.avoidColors) &&
            colorMatching.avoidColors.length > 0) {
            normalized.colorMatching.avoidColors =
                colorMatching.avoidColors.filter((color): color is string => typeof color === 'string');
        }
    }

    // Process seasonal recommendations
    if (suggestions.seasonalRecommendations && typeof suggestions.seasonalRecommendations === 'object') {
        const seasonalRecs = suggestions.seasonalRecommendations as Record<string, unknown>;
        const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
        seasons.forEach(season => {
            if (typeof seasonalRecs[season] === 'string') {
                normalized.seasonalRecommendations[season] = seasonalRecs[season] as string;
            }
        });
    }

    return normalized;
}

// Function to get style suggestions from Anthropic Claude
async function getLLMStyleSuggestions(images: FormDataEntryValue[]) {
    try {
        // Initialize Anthropic client
        console.log('[API] Initializing Anthropic client');
        const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || '',
        });

        // Process images to base64
        console.log('[API] Converting images to base64');
        const imageContents = await Promise.all(
            images.map(async (image, index) => {
                if (image instanceof File) {
                    console.log(`[API] Processing image ${index + 1}: ${image.name} (${image.size} bytes, type: ${image.type})`);
                    const bytes = await image.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const base64Image = buffer.toString('base64');
                    // Ensure media type is one of the accepted types for Anthropic API
                    let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg";
                    if (image.type === "image/png" || image.type === "image/gif" || image.type === "image/webp") {
                        mediaType = image.type as "image/png" | "image/gif" | "image/webp";
                    }

                    return {
                        type: "image" as const,
                        source: {
                            type: "base64" as const,
                            media_type: mediaType,
                            data: base64Image
                        }
                    };
                }
                console.log(`[API] Skipping non-file image at index ${index}`);
                return null;
            })
        );

        // Filter out null values
        const validImageContents = imageContents.filter(Boolean) as {
            type: "image";
            source: {
                type: "base64";
                media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
                data: string;
            };
        }[];

        console.log(`[API] Processed ${validImageContents.length} valid images`);

        if (validImageContents.length === 0) {
            console.error('[API] No valid images to process');
            throw new Error('No valid images to process');
        }

        // Create a more structured prompt to force Claude to respond in a specific format
        const systemPrompt = `Style Recommendation API System Prompt
You are an AI assistant operating as a clothing style recommendation service. Your primary function is to analyze clothing images uploaded by users and provide personalized style suggestions.

CRITICAL INSTRUCTION: You must ONLY output a valid JSON object and nothing else. Do not include any explanatory text, markdown formatting, or code blocks. Just the raw JSON.

Follow these steps precisely:
1. Analyze the clothing images
2. Create style recommendations
3. Output ONLY a JSON object with this exact structure:

{
  "outfitIdeas": [
    {
      "title": "Urban Casual",
      "description": "A relaxed yet stylish look perfect for city outings",
      "items": [
        "Pair with dark wash slim jeans",
        "Add white sneakers for a clean look",
        "Layer with a denim or leather jacket for cooler weather"
      ]
    }
  ],
  "colorMatching": {
    "complementaryColors": ["#3B5F41", "#2B4073", "#6B4C39"],
    "avoidColors": ["#FF5733", "#D1B000"]
  },
  "seasonalRecommendations": {
    "spring": "Light layering with pastels",
    "summer": "Keep it breathable with lighter fabrics",
    "fall": "Add earth tones and light outerwear",
    "winter": "Layer with heavier items in darker tones"
  }
}`;

        // Create message with Claude API using streaming
        console.log('[API] Sending request to Anthropic API');
        let fullContent = '';
        const stream = await client.beta.messages.stream({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 16000,
            temperature: 0.7, // Reduced temperature for more consistent formatting
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze these clothing items and provide style recommendations in JSON format only. Just give me the raw JSON with no explanations or markdown."
                        },
                        ...validImageContents
                    ]
                }
            ],
            tools: [
                {
                    name: "web_search",
                    type: "web_search_20250305"
                }
            ],
            betas: ["web-search-2025-03-05", "output-128k-2025-02-19"]
        });

        // Process the stream response
        console.log('[API] Processing stream response');
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' &&
                'delta' in chunk &&
                'text' in chunk.delta) {
                fullContent += chunk.delta.text;
            }
        }

        console.log('[API] Completed receiving response from Anthropic');

        // Save the raw content to a file for debugging (in development)
        if (process.env.NODE_ENV === 'development') {
            try {
                // Create debug directory if it doesn't exist
                if (!fs.existsSync(path.join(process.cwd(), 'debug'))) {
                    fs.mkdirSync(path.join(process.cwd(), 'debug'), { recursive: true });
                }

                // Write the raw response to a file with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                fs.writeFileSync(
                    path.join(process.cwd(), 'debug', `claude-response-${timestamp}.txt`),
                    fullContent
                );
                console.log('[API] Saved raw Claude response to debug file');
            } catch (error) {
                console.error('[API] Error saving debug file:', error);
            }
        }

        // Ultra robust JSON extraction and parsing
        return extractValidJSON(fullContent);
    } catch (error) {
        console.error('[API] Error calling Anthropic API:', error);
        return createDefaultStyleSuggestion();
    }
}

/**
 * Super robust JSON extraction from text
 */
function extractValidJSON(text: string) {
    console.log('[API] Attempting to extract valid JSON from raw text');

    // First, try direct JSON parsing of the entire response
    try {
        const directParse = JSON.parse(text.trim());
        console.log('[API] Successfully parsed entire response as JSON');
        return normalizeStyleSuggestions(directParse);
    } catch {
        console.log('[API] Direct parsing failed, attempting JSON extraction');
    }

    // Try to find and extract JSON object from text
    try {
        // Look for a JSON object using regex
        const jsonMatch = text.match(/(\{[\s\S]*\})/g);
        if (jsonMatch && jsonMatch.length > 0) {
            const jsonCandidate = jsonMatch[0];
            try {
                console.log('[API] Found potential JSON object, attempting to parse');
                const parsed = JSON.parse(jsonCandidate);
                console.log('[API] Successfully parsed extracted JSON');
                return normalizeStyleSuggestions(parsed);
            } catch (e) {
                console.error('[API] Error parsing extracted JSON:', e);
            }
        }
    } catch (e) {
        console.error('[API] Error in JSON extraction:', e);
    }

    // If all else fails, try to manually extract structured data
    console.log('[API] Attempting manual data extraction');
    return manualDataExtraction(text);
}

/**
 * Manual extraction of data from Claude's text output when JSON parsing fails
 */
function manualDataExtraction(text: string): StyleSuggestion {
    const extractedData: StyleSuggestion = createDefaultStyleSuggestion();

    try {
        // Regular expressions to find key information
        const outfitTitleRegex = /"title"\s*:\s*"([^"]+)"/g;
        const outfitDescRegex = /"description"\s*:\s*"([^"]+)"/g;
        const itemsStartRegex = /"items"\s*:\s*\[/g;
        const colorRegex = /#[0-9A-Fa-f]{6}/g;
        const seasonRegex = /"(spring|summer|fall|winter)"\s*:\s*"([^"]+)"/g;

        // Extract outfit titles
        const titles: string[] = [];
        let match;
        while ((match = outfitTitleRegex.exec(text)) !== null) {
            titles.push(match[1]);
        }

        // Extract outfit descriptions
        const descriptions: string[] = [];
        while ((match = outfitDescRegex.exec(text)) !== null) {
            descriptions.push(match[1]);
        }

        // Extract color codes
        const colors: string[] = [];
        while ((match = colorRegex.exec(text)) !== null) {
            colors.push(match[0]);
        }

        // Extract seasonal recommendations
        const seasons: Record<string, string> = {};
        while ((match = seasonRegex.exec(text)) !== null) {
            seasons[match[1]] = match[2];
        }

        // If we found titles, create outfit ideas
        if (titles.length > 0) {
            extractedData.outfitIdeas = titles.map((title, index) => {
                return {
                    title: title,
                    description: descriptions[index] || "Stylish outfit recommendation",
                    items: [
                        "Style recommendation extracted from AI response",
                        "Pair with complementary accessories",
                        "Consider layering options appropriate for the season"
                    ]
                };
            });
        }

        // If we found colors, assign them to complementary/avoid categories
        if (colors.length > 0) {
            // Assign first 3 colors to complementary, rest to avoid (if any)
            extractedData.colorMatching.complementaryColors = colors.slice(0, 3);
            if (colors.length > 3) {
                extractedData.colorMatching.avoidColors = colors.slice(3, 5);
            }
        }

        // If we found seasonal recommendations, use them
        if (Object.keys(seasons).length > 0) {
            Object.entries(seasons).forEach(([season, recommendation]) => {
                if (season === 'spring' || season === 'summer' ||
                    season === 'fall' || season === 'winter') {
                    extractedData.seasonalRecommendations[season] = recommendation;
                }
            });
        }

        console.log('[API] Manual extraction completed',
            `Found ${titles.length} outfits, ${colors.length} colors, ${Object.keys(seasons).length} seasons`);
    } catch (e) {
        console.error('[API] Error in manual data extraction:', e);
    }

    return extractedData;
} 
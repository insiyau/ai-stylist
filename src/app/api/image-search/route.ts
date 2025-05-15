import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');
        const limit = parseInt(searchParams.get('limit') || '6', 10);

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        console.log(`[Image Search] Searching for images matching: "${query}"`);

        // Use Claude's web search capabilities for image search
        const searchResults = await searchImagesWithClaude(query, limit);

        return NextResponse.json({ images: searchResults });
    } catch (error) {
        console.error('Error in image search API:', error);
        return NextResponse.json(
            { error: 'Failed to process image search' },
            { status: 500 }
        );
    }
}

/**
 * Uses Claude to search for images on the web
 */
async function searchImagesWithClaude(query: string, limit: number = 6) {
    // Early return if no API key
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error('[Image Search] Anthropic API key is not set');
        return generateMockImages(query, limit);
    }

    try {
        // Initialize Anthropic client
        const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Prepare the search prompt for finding relevant images
        const searchPrompt = `I need ${limit} high quality images of "${query}" for a fashion mood board. 
        Please search the web and find visually appealing fashion images related to this query.
        
        Return ONLY a JSON array of image objects, each with:
        1. url: The direct image URL
        2. title: A short descriptive title
        3. source: The source website

        Return the JSON and NOTHING else.`;

        // Call Claude with web search capabilities
        console.log('[Image Search] Calling Claude with web search');
        const response = await client.beta.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 1024,
            temperature: 0.1,
            system: "You are a helpful assistant specialized in finding fashion-related images. Only respond with valid JSON arrays following the requested format.",
            messages: [
                {
                    role: "user",
                    content: searchPrompt
                }
            ],
            tools: [
                {
                    name: "web_search",
                    type: "web_search_20250305"
                }
            ],
            betas: ["web-search-2025-03-05"]
        });

        // Extract the response content
        let responseContent = '';
        for (const content of response.content) {
            if (content.type === 'text') {
                responseContent += content.text;
            }
        }
        console.log('[Image Search] Claude response:', responseContent.substring(0, 200) + '...');

        // Extract JSON array from response
        try {
            // Try to find a JSON array in the response
            const jsonMatch = responseContent.match(/(\[[\s\S]*\])/);
            if (jsonMatch && jsonMatch[0]) {
                const jsonArray = JSON.parse(jsonMatch[0]);
                console.log(`[Image Search] Found ${jsonArray.length} images`);

                // Validate and clean the results
                const validatedImages = jsonArray
                    .filter((img: any) => img.url && typeof img.url === 'string')
                    .map((img: any) => ({
                        url: img.url,
                        title: img.title || query,
                        source: img.source || 'Web'
                    }))
                    .slice(0, limit);

                return validatedImages;
            }
        } catch (parseError) {
            console.error('[Image Search] Error parsing Claude response:', parseError);
        }

        // Fall back to mock images if parsing fails
        console.log('[Image Search] Falling back to mock images');
        return generateMockImages(query, limit);
    } catch (error) {
        console.error('[Image Search] Error searching with Claude:', error);
        return generateMockImages(query, limit);
    }
}

/**
 * Generates mock image data for development purposes or fallback
 */
function generateMockImages(query: string, limit: number) {
    const queryTerms = query.toLowerCase().split(' ');

    // More specific fashion-related mock images based on common search terms
    const fashionImageMap: Record<string, string[]> = {
        casual: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
            'https://images.unsplash.com/photo-1603344797033-f0f4f587ab60',
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
        ],
        formal: [
            'https://images.unsplash.com/photo-1593032465175-481ac7f401f0',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc'
        ],
        spring: [
            'https://images.unsplash.com/photo-1523381294911-8d3cead13475',
            'https://images.unsplash.com/photo-1596992879119-badb0e683b75',
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2'
        ],
        summer: [
            'https://images.unsplash.com/photo-1534119428213-bd2626145164',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae',
            'https://images.unsplash.com/photo-1601370552761-eda0ff296db6'
        ],
        fall: [
            'https://images.unsplash.com/photo-1530041539828-114de669390e',
            'https://images.unsplash.com/photo-1520006403909-838d6b92c22e',
            'https://images.unsplash.com/photo-1511735111819-9a3f7709049c'
        ],
        winter: [
            'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2',
            'https://images.unsplash.com/photo-1548883354-7622d03aca27',
            'https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a'
        ],
        jeans: [
            'https://images.unsplash.com/photo-1511105043137-7e66f28270e3',
            'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec',
            'https://images.unsplash.com/photo-1598554747436-c9293d6a588f'
        ],
        dress: [
            'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03',
            'https://images.unsplash.com/photo-1623335082260-16256c0dd220',
            'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5'
        ],
        jacket: [
            'https://images.unsplash.com/photo-1548126032-079a0fb0099d',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
            'https://images.unsplash.com/photo-1578681994506-b8f463449011'
        ],
        shoes: [
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
            'https://images.unsplash.com/photo-1542280756-74b2f55e73ab',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2'
        ],
        accessories: [
            'https://images.unsplash.com/photo-1584287882055-7c13efff2c86',
            'https://images.unsplash.com/photo-1601923157214-ca717e8e576c',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a'
        ]
    };

    // Determine which fashion category to use based on the query terms
    let imageOptions: string[] = [];
    for (const term of queryTerms) {
        for (const [category, images] of Object.entries(fashionImageMap)) {
            if (term.includes(category) || category.includes(term)) {
                imageOptions = [...imageOptions, ...images];
            }
        }
    }

    // If no specific category was matched, use a mix of all categories
    if (imageOptions.length === 0) {
        Object.values(fashionImageMap).forEach(images => {
            imageOptions = [...imageOptions, ...images];
        });
    }

    // Shuffle the array to get random selections
    const shuffled = [...imageOptions].sort(() => 0.5 - Math.random());

    // Generate the mock images with relevant titles
    const mockImages = shuffled.slice(0, limit).map((url, index) => ({
        url,
        title: `${query} - Fashion style ${index + 1}`,
        source: 'Mock Image'
    }));

    return mockImages;
} 
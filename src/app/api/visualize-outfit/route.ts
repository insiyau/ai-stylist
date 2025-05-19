import { NextRequest, NextResponse } from 'next/server';
import OpenAI, { toFile } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface OutfitDetails {
    title: string;
    description: string;
    items: string[];
}

export async function POST(request: NextRequest) {
    if (!process.env.OPENAI_API_KEY) {
        console.error('[API /visualize-outfit] OpenAI API key is not set');
        return NextResponse.json({ error: 'Configuration error: OpenAI API key not set.' }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;
        const outfitDetailsString = formData.get('outfitDetails') as string | null;

        if (!imageFile) {
            return NextResponse.json({ error: 'Image file is required for visualization.' }, { status: 400 });
        }
        if (!outfitDetailsString) {
            return NextResponse.json({ error: 'Outfit details are required.' }, { status: 400 });
        }

        let outfitDetails: OutfitDetails;
        try {
            outfitDetails = JSON.parse(outfitDetailsString);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid outfit details format.' }, { status: 400 });
        }

        console.log(`[API /visualize-outfit] Received outfit details for keyword extraction: ${outfitDetails.title}`);

        // Step 1: Generate keywords using gpt-4o
        const keywordSystemPrompt = "You are given a description of an outfit/clothing style. Generate 5-10 keywords as a comma separated string. Return JSON only in this format: { \"keywords\": \"keyword1, keyword2, ...\" }";
        const rawOutfitDescriptionForKeywords = `Title: ${outfitDetails.title}\nDescription: ${outfitDetails.description}\nItems: ${outfitDetails.items.join(', ')}`;

        let extractedKeywords = '';
        try {
            const keywordResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: keywordSystemPrompt },
                    { role: "user", content: rawOutfitDescriptionForKeywords },
                ],
                temperature: 0.5, // Lower temperature for more focused keyword extraction
            });

            if (keywordResponse.choices[0]?.message?.content) {
                const parsedKeywords = JSON.parse(keywordResponse.choices[0].message.content);
                if (parsedKeywords.keywords && typeof parsedKeywords.keywords === 'string') {
                    extractedKeywords = parsedKeywords.keywords;
                    console.log(`[API /visualize-outfit] Extracted keywords: ${extractedKeywords}`);
                } else {
                    console.warn('[API /visualize-outfit] Keywords not found or not a string in gpt-4o response.', parsedKeywords);
                }
            } else {
                console.warn('[API /visualize-outfit] No content in gpt-4o response for keywords.');
            }
        } catch (keywordError) {
            console.error('[API /visualize-outfit] Error generating keywords with gpt-4o:', keywordError);
            // Proceed without keywords if generation fails, or handle error more strictly
        }

        // Step 2: Construct the final prompt for image editing
        const finalImageEditPrompt = `Using the provided clothing item image as the main piece, display it on a photorealistic mannequin. \nThe complete outfit is titled '${outfitDetails.title}' (${outfitDetails.description.toLowerCase()}). \nKey items include: ${outfitDetails.items.join(', ')}. \n${extractedKeywords ? `Incorporate these style keywords and ambiance: ${extractedKeywords}. ` : ''}\nEnsure the original item from the image is accurately represented and not modified in any way. Maintain a full body shot against a clean, minimalist studio background.`;

        console.log(`[API /visualize-outfit] Final prompt for image edit: "${finalImageEditPrompt.substring(0, 150)}..." and image: ${imageFile.name}`);

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadableImage = await toFile(imageBuffer, imageFile.name || 'uploaded_image.png', {
            type: imageFile.type || 'image/png',
        });

        const response = await openai.images.edit({
            model: "gpt-image-1",
            image: uploadableImage,
            prompt: finalImageEditPrompt,
            n: 1,
            size: "1024x1024",
            quality: "high",
        });

        if (!response.data || response.data.length === 0) {
            console.error('[API /visualize-outfit] OpenAI edit response did not include data array or it was empty:', response);
            throw new Error('OpenAI image edit response was empty or malformed.');
        }

        const imageB64Json = response.data[0]?.b64_json;

        if (!imageB64Json) {
            console.error('[API /visualize-outfit] No image data (b64_json) received from OpenAI edit response data[0]:', response.data[0]);
            throw new Error('Failed to edit image or no b64_json data returned by OpenAI in the first data item.');
        }

        console.log('[API /visualize-outfit] Successfully edited image with OpenAI.');
        return NextResponse.json({ b64_json: imageB64Json });

    } catch (error: unknown) {
        console.error('[API /visualize-outfit] Error in POST /api/visualize-outfit:', error);
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof OpenAI.APIError) {
            errorMessage = `OpenAI API Error: ${error.status} ${error.name} - ${error.message}`;
            if (error.code) { errorMessage += ` (Code: ${error.code})`; }
            if (error.param) { errorMessage += ` (Param: ${error.param})`; }
            console.error('[API /visualize-outfit] OpenAI API Error details:', JSON.stringify(error, null, 2));
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

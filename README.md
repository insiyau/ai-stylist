# AI Stylist App

An AI-powered fashion stylist application that takes images of your clothing and accessories and provides personalized styling recommendations.

## Features

- Image upload for clothing items and accessories
- Photo capture directly from camera
- AI-powered style recommendations
- Outfit combinations and color matching
- Seasonal styling advice
- **Privacy-focused**: Images are processed in-memory only and never stored on our servers

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Integration with Claude 4 Sonnet and gpt-image-1
- **Image Processing**: Client-side image handling with temporary in-memory processing (no storage)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd ai-stylist
npm install
```

3. Create an `.env.local` file in the project root and add your LLM API keys:

```
# For OpenAI (gpt-image-1)
OPENAI_API_KEY=your_openai_key_here

# For Anthropic (Claude 4)
ANTHROPIC_API_KEY=your_anthropic_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## LLM Integration

### Current setup:

1. **gpt-image-1**
   - One of the best image generation models; used for the visualization feature
   - Strong fashion knowledge base
   - Implementation: Use the OpenAI API with the `gpt-image-1` model

2. **Anthropic Claude 4 Sonnet**
   - Advanced multimodal capabilities
   - Detailed reasoning capabilities
   - Implementation: Use the Anthropic API with the `claude-sonnet-4-20250514` model

### Implementation Steps:

1. Install the appropriate SDK:
   ```bash
   # For OpenAI
   npm install openai
   
   # For Anthropic
   npm install @anthropic-ai/sdk
   ```

2. Update the API route in `src/app/api/style-suggestions/route.ts` to call the Claude API for style suggestions

2. Update the API route in `src/app/api/visualize-outfit/route.ts` to call the OpenAI API for image generation

## Privacy

This application is designed with privacy in mind:

- Images are processed in-memory only and are never stored on the server
- No user data is collected or retained
- All processing happens in real-time and images are discarded after generating recommendations
- When implementing the LLM integration, images should be passed directly to the LLM API and not stored

## Deployment

This application can be deployed to Vercel with minimal configuration:

```bash
npm install -g vercel
vercel
```

## Future Enhancements

- User accounts and saved outfits (opt-in only)
- Social sharing functionality
- Integration with e-commerce platforms for similar item recommendations
- Seasonal trend updates
- Virtual wardrobe management (client-side only for privacy)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

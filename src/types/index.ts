export interface OutfitIdea {
    title: string;
    description: string;
    items: string[];
}

export interface ColorMatching {
    complementaryColors: string[];
    avoidColors: string[];
}

export interface SeasonalRecommendations {
    spring: string;
    summer: string;
    fall: string;
    winter: string;
}

export interface StyleSuggestion {
    outfitIdeas: OutfitIdea[];
    colorMatching: ColorMatching;
    seasonalRecommendations: SeasonalRecommendations;
    moodBoards: string[];
} 
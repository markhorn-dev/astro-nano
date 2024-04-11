export type Project = {
    title: string;
    description: string;
    date: Date;
    draft?: boolean;
    demoURL?: string;
    repoURL?: string;
    statusRating?: 'in-progress' | 'on-hold' | 'completed' | 'delayed' | 'upcoming' | 'cancelled' | 'under-review' | 'needs-attention' | 'awaiting-feedback' | 'testing-phase' | 'polishing';
    timeInvestmentRating: 'low' | 'medium' | 'high';
    necessityRating: 'low' | 'medium' | 'high';
    categories: ('Gardening' | 'Cooking & Baking' | 'Software' | 'Data Analysis and Machine Learning' | 'Hardware & Repairs')[];
};

export enum Category {
    Gardening = "Gardening",
    CookingAndBaking = "Cooking & Baking",
    Software = "Software",
    DataAnalysisAndMachineLearning = "Data Analysis and Machine Learning",
    HardwareAndRepairs = "Hardware & Repairs"
}

export const allCategories: Category[] = Object.values(Category);

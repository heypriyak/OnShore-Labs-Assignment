export type ReviewSource = 'Google' | 'Zomato' | 'TripAdvisor' | 'Swiggy' | 'Reddit' | 'Blog';

export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Emotion = 'happy' | 'impressed' | 'frustrated' | 'disappointed' | 'neutral';
export type Priority = 'low' | 'medium' | 'high';

export interface ReviewItem {
  id: string;
  source: ReviewSource;
  author: string;
  title: string;
  text: string;
  rating?: number;
  timestamp: string;
  sentiment: Sentiment;
  emotion: Emotion;
  priority: Priority;
  topics: string[];
  likes?: number;
  urgent?: boolean;
}

export interface BusinessInput {
  businessName: string;
  location: string;
  website?: string;
}

export interface DashboardData {
  input: BusinessInput;
  totalMentions: number;
  averageRating: number;
  sentimentCounts: Record<Sentiment, number>;
  sourceCounts: Record<ReviewSource, number>;
  recentReviews: ReviewItem[];
  topComplaints: string[];
  topCompliments: string[];
  urgentReviews: ReviewItem[];
  summary: {
    overall: string;
    positive: string;
    neutral: string;
    negative: string;
    recommendations: string[];
  };
}

import { BusinessInput, DashboardData, ReviewItem, Sentiment } from '@/lib/types';
import { generateMockReviews } from '@/lib/mock-data';

function countBySentiment(reviews: ReviewItem[]): Record<Sentiment, number> {
  return reviews.reduce(
    (acc, review) => {
      acc[review.sentiment] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );
}

function countBySource(reviews: ReviewItem[]): Record<ReviewItem['source'], number> {
  return reviews.reduce(
    (acc, review) => {
      acc[review.source] = (acc[review.source] ?? 0) + 1;
      return acc;
    },
    { Google: 0, Zomato: 0, TripAdvisor: 0, Swiggy: 0, Reddit: 0, Blog: 0 }
  );
}

function topPhrases(reviews: ReviewItem[], sentiment: Sentiment, limit: number): string[] {
  const counts = new Map<string, number>();

  reviews
    .filter((review) => review.sentiment === sentiment)
    .forEach((review) => {
      review.topics.forEach((topic) => {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      });
    });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic);
}

function buildRecommendations(reviews: ReviewItem[]): string[] {
  const counts = new Map<string, number>();

  reviews.forEach((review) => {
    review.topics.forEach((topic) => counts.set(topic, (counts.get(topic) ?? 0) + 1));
  });

  const mostCommon = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return mostCommon.map(([topic, count]) => {
    if (topic.includes('service') || topic.includes('wait')) {
      return `Many mentions of ${topic} suggest adding staff support during peak hours.`;
    }
    if (topic.includes('pricing') || topic.includes('billing')) {
      return `Several reviews mention ${topic}. Clarify pricing, bundles, or inclusions more clearly.`;
    }
    if (topic.includes('ambience') || topic.includes('cleanliness')) {
      return `Customers appreciate the ${topic}; feature it more prominently in marketing and social posts.`;
    }
    return `Track ${topic} across channels. It appears in ${count} mentions and may deserve an operational owner.`;
  });
}

export function buildDashboard(input: BusinessInput): DashboardData {
  const reviews = generateMockReviews(input);
  const sentimentCounts = countBySentiment(reviews);
  const sourceCounts = countBySource(reviews);
  const averageRating = Number(
    (reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviews.filter((review) => review.rating).length).toFixed(1)
  );
  const urgentReviews = reviews.filter((review) => review.urgent || review.priority === 'high').slice(0, 4);
  const sortedByTime = [...reviews].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));

  return {
    input,
    totalMentions: reviews.length,
    averageRating,
    sentimentCounts,
    sourceCounts,
    recentReviews: sortedByTime.slice(0, 8),
    topComplaints: topPhrases(reviews, 'negative', 5),
    topCompliments: topPhrases(reviews, 'positive', 5),
    urgentReviews,
    summary: {
      overall: `Overall, ${input.businessName} shows a balanced reputation with ${sentimentCounts.positive} positive, ${sentimentCounts.neutral} neutral, and ${sentimentCounts.negative} negative mentions across public platforms.`,
      positive: `Guests like the ${topPhrases(reviews, 'positive', 3).join(', ') || 'service'} experience and frequently mention the staff and ambience.`,
      neutral: `Neutral feedback mostly focuses on ${topPhrases(reviews, 'neutral', 3).join(', ') || 'wait time'} and suggests the business is functional but not memorable in every visit.`,
      negative: `Negative reviews cluster around ${topPhrases(reviews, 'negative', 3).join(', ') || 'service issues'} and should be reviewed with operational owners.`,
      recommendations: buildRecommendations(reviews).slice(0, 5)
    }
  };
}

export function composeResponse(review: ReviewItem): string {
  if (review.sentiment === 'negative') {
    return `We’re sorry to hear about your experience, and we appreciate you bringing this to our attention. We’re reviewing ${review.topics.slice(0, 2).join(' and ')} with our team to make sure we improve quickly.`;
  }

  if (review.sentiment === 'neutral') {
    return `Thank you for your feedback. We’re glad aspects like ${review.topics.slice(0, 2).join(' and ')} worked well, and we’ll continue improving the parts that matter most.`;
  }

  return `Thank you for the kind words. We’re glad you enjoyed the ${review.topics.slice(0, 2).join(' and ')} experience, and we’ll share your feedback with the team.`;
}

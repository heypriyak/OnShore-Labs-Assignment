import { BusinessInput, ReviewItem, ReviewSource } from '@/lib/types';

const sourcePool: ReviewSource[] = ['Google', 'Zomato', 'TripAdvisor', 'Swiggy', 'Reddit', 'Blog'];

const topicBank = {
  positive: ['ambience', 'hospitality', 'taste', 'presentation', 'service'],
  neutral: ['pricing', 'availability', 'location', 'wait time', 'menu variety'],
  negative: ['slow service', 'hygiene', 'billing', 'cold food', 'staff behavior']
};

const reviewTemplates = [
  {
    sentiment: 'positive' as const,
    emotion: 'happy' as const,
    priority: 'low' as const,
    title: 'Memorable dining experience',
    text: 'Loved the ambience and the food quality. The staff made us feel welcome and the dessert was a highlight.',
    rating: 5,
    topics: ['ambience', 'food quality', 'hospitality']
  },
  {
    sentiment: 'positive' as const,
    emotion: 'impressed' as const,
    priority: 'low' as const,
    title: 'Great service and clean space',
    text: 'Service was attentive, the restaurant was spotless, and the team handled our group smoothly.',
    rating: 4,
    topics: ['service', 'hygiene', 'cleanliness']
  },
  {
    sentiment: 'neutral' as const,
    emotion: 'neutral' as const,
    priority: 'medium' as const,
    title: 'Decent but room for improvement',
    text: 'Good location and menu options, but the wait time was a little longer than expected during peak hours.',
    rating: 3,
    topics: ['location', 'wait time', 'menu variety']
  },
  {
    sentiment: 'negative' as const,
    emotion: 'frustrated' as const,
    priority: 'high' as const,
    title: 'Slow weekend service',
    text: 'We waited almost 40 minutes for the starter and had to ask twice for water. This should be fixed urgently.',
    rating: 2,
    topics: ['slow service', 'wait time', 'staff behavior'],
    urgent: true
  },
  {
    sentiment: 'negative' as const,
    emotion: 'disappointed' as const,
    priority: 'high' as const,
    title: 'Food quality inconsistency',
    text: 'The previous visit was great, but this time the food was cold and the portion size felt smaller.',
    rating: 2,
    topics: ['cold food', 'food quality', 'pricing'],
    urgent: true
  }
];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function hashSeed(text: string): number {
  return Array.from(text.toLowerCase()).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function generateMockReviews(input: BusinessInput): ReviewItem[] {
  const seed = hashSeed(`${input.businessName}-${input.location}-${input.website ?? ''}`);
  const count = 14 + (seed % 9);
  const baseTimestamp = Date.UTC(2026, 5, 10, 12, 0, 0) + (seed % 21) * 24 * 60 * 60 * 1000;

  return Array.from({ length: count }, (_, index) => {
    const template = reviewTemplates[(seed + index) % reviewTemplates.length];
    const source = pick(sourcePool, seed + index);
    const extraTopic = pick(
      [...topicBank.positive, ...topicBank.neutral, ...topicBank.negative],
      seed * 3 + index
    );

    const isHotel = /hotel|resort|stay|inn|suite/i.test(input.businessName);
    const suffix = isHotel
      ? 'Guests mentioned the room and staff experience.'
      : 'Customers repeatedly mentioned the food and service.';

    return {
      id: `${source.toLowerCase()}-${index + 1}`,
      source,
      author: `Reviewer ${index + 1}`,
      title: `${template.title} for ${input.businessName}`,
      text: `${template.text} ${suffix}`,
      rating: template.rating,
      timestamp: new Date(baseTimestamp - index * 1000 * 60 * 60 * 14).toISOString(),
      sentiment: template.sentiment,
      emotion: template.emotion,
      priority: template.priority,
      topics: Array.from(new Set([extraTopic, ...template.topics].filter(Boolean))),
      likes: 2 + ((seed + index * 7) % 45),
      urgent: template.urgent,
    };
  });
}

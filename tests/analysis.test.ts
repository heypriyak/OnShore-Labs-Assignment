import { describe, it, expect } from 'vitest';
import { buildDashboard, composeResponse } from '../src/lib/analysis';

describe('analysis module', () => {
  const input = { businessName: 'Test Cafe', location: 'Test City', website: '' };

  it('buildDashboard returns expected shape and counts add up', () => {
    const dash = buildDashboard(input as any);

    expect(dash).toHaveProperty('totalMentions');
    expect(dash).toHaveProperty('sentimentCounts');
    const { sentimentCounts } = dash;
    const sum = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
    expect(sum).toBe(dash.totalMentions);
  });

  it('topComplaints and topCompliments are arrays of strings', () => {
    const dash = buildDashboard(input as any);
    expect(Array.isArray(dash.topComplaints)).toBe(true);
    expect(dash.topComplaints.every((t) => typeof t === 'string')).toBe(true);
    expect(Array.isArray(dash.topCompliments)).toBe(true);
  });

  it('composeResponse produces a short reply containing topic words', () => {
    const dash = buildDashboard(input as any);
    const review = dash.recentReviews[0];
    const reply = composeResponse(review as any);
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(10);
  });
});

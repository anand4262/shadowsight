import { getManagerOutcomeDistribution } from '@/utils/GlobalHelpers';

describe('getManagerOutcomeDistribution', () => {
  it('should return correct labels and series counts for mixed valid actions', () => {
    const sampleData = [
      { managerAction: 'knownGoodActivity' },
      { managerAction: 'escalated' },
      { managerAction: 'employeeCounselled' },
      { managerAction: 'unknownAction' },
      { managerAction: '' },               // becomes 'unknown'
      { managerAction: null },             // becomes 'unknown'
    ];

    const result = getManagerOutcomeDistribution(sampleData);

    expect(result.labels).toEqual(
      expect.arrayContaining([
        'knowngoodactivity',
        'escalated',
        'employeecounselled',
        'unknownaction',
        'unknown',
      ])
    );

    expect(result.series).toHaveLength(result.labels.length);
    const total = result.series.reduce((sum, count) => sum + count, 0);
    expect(total).toBe(sampleData.length);
  });

  it('should handle missing managerAction fields gracefully', () => {
    const dataWithMissing = [
      {}, // no managerAction
      { managerAction: null },
      { managerAction: undefined },
    ];

    const result = getManagerOutcomeDistribution(dataWithMissing);

    expect(result.labels).toEqual(['unknown']);
    expect(result.series).toEqual([3]);
  });

  it('should handle non-string managerAction values', () => {
    const weirdData = [
      { managerAction: 123 },
      { managerAction: {} },
      { managerAction: ['employeeCounselled'] },
    ];

    const result = getManagerOutcomeDistribution(weirdData);

    expect(result.labels).toEqual(['unknown']);
    expect(result.series).toEqual([3]);
  });
});

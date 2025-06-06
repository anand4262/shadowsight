import { getTimeOfDayDistribution } from '@/utils/GlobalHelpers';

describe('getTimeOfDayDistribution', () => {
  it('should return correct distribution for sample data', () => {
    const sampleData = [
      { time: '00:15' },
      { time: '01:30' },
      { time: '13:00' },
      { time: '13:45' },
      { time: '23:59' },
    ];

    const { labels, series } = getTimeOfDayDistribution(sampleData);

    expect(labels.length).toBe(24);
    expect(series.length).toBe(24);

    const index00 = labels.indexOf('12 AM');
    const index01 = labels.indexOf('1 AM');
    const index13 = labels.indexOf('1 PM');
    const index23 = labels.indexOf('11 PM');

    expect(series[index00]).toBe(1);
    expect(series[index01]).toBe(1);
    expect(series[index13]).toBe(2);
    expect(series[index23]).toBe(1);
  });

  it('should return 24 hourly buckets with zero counts for empty input', () => {
    const { labels, series } = getTimeOfDayDistribution([]);

    expect(labels.length).toBe(24);
    expect(series.length).toBe(24);
    expect(series.every((count) => count === 0)).toBe(true);
  });

  it('should skip invalid or malformed time values', () => {
  const invalidData = [
    { time: 'invalid' },
    { time: '' },
    { time: null },
    { time: undefined },
    {}, // no time property
  ];

  const { labels, series } = getTimeOfDayDistribution(invalidData);

  expect(labels.length).toBe(24);
  expect(series.length).toBe(24);
  expect(series.every((count) => count === 0)).toBe(true); // All should be 0
});

});

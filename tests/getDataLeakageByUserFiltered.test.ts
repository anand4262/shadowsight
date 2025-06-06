import { getDataLeakageByUserFiltered } from '@/utils/GlobalHelpers';

describe('getDataLeakageByUserFiltered', () => {
  it('should return users with leakage count greater than 10', () => {
    const sampleData = [];

    // Add 11 valid leakage entries for a@example.com
    for (let i = 0; i < 11; i++) {
      sampleData.push({
        user: 'a@example.com',
        policiesBreached: {
          dataLeakage: ['emailContainedDocuments'],
        },
      });
    }

    // Add 5 entries for b@example.com which should be ignored (count <= 10)
    for (let i = 0; i < 5; i++) {
      sampleData.push({
        user: 'b@example.com',
        policiesBreached: {
          dataLeakage: ['emailContainedDocuments'],
        },
      });
    }

    // Add entries without dataLeakage (should be ignored)
    sampleData.push({
      user: 'c@example.com',
      policiesBreached: {
        dataLeakage: [],
      },
    });

    // Add entries with malformed policies (should be ignored)
    sampleData.push({
      user: 'd@example.com',
      policiesBreached: null,
    });

    const { labels, series } = getDataLeakageByUserFiltered(sampleData);

    expect(labels).toEqual(['a@example.com']);
    expect(series).toEqual([11]);
  });
});

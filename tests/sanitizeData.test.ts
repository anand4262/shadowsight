import { sanitizeDataAsync, ExtendedCSVRecord } from '@/utils/SanitizeData'; 

describe('sanitizeDataAsync', () => {
  it('should sanitize raw data and return valid ExtendedCSVRecord[]', async () => {
    const rawInput = [
      {
        activityId: '01JHH7WVXCNK5YE83V5VBTBGEY',
        user: '  jacob.moore@zenith.com ',
        date: '13/01/2025',
        time: '17:55',
        riskScore: 500,
        integration: ' si-email ',
        policiesBreached: JSON.stringify({
          dataLeakage: ['emailContainedDocuments']
        }),
        values: JSON.stringify({
          destinations: ['jmoore73@gmail.com']
        }),
        status: 'underReview',
        managerAction: '',
        dataVolumeMB: 150
      }
    ];

    const result = await sanitizeDataAsync(rawInput as any); // Pass as untyped input

    expect(result).toHaveLength(1);

    const record: ExtendedCSVRecord = result[0];

    expect(record.user).toBe('jacob.moore@zenith.com');
    expect(record.integration).toBe('si-email');
    expect(record.policiesBreached.dataLeakage).toContain('emailContainedDocuments');
    expect(record.values.destinations).toContain('jmoore73@gmail.com');
    expect(typeof record.riskScore).toBe('number');
    expect(record.dataVolumeMB).toBe(150);
    expect(record.date).toContain('2025-01-13'); // ISO formatted
  });
});



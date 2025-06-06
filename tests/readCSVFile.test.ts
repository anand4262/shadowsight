import readCSVFile from '@/utils/readCSVFile'

const mockCSV = `userName,emailActivity,usbActivity,cloudActivity,managerAction
john.doe@example.com,5,0,3,KnownGoodActivity
jane.smith@example.com,2,1,0,Escalated`;

function createMockFile(content: string, name = 'mock.csv', type = 'text/csv'): File {
  return new File([content], name, { type });
}

describe('readCSVFile', () => {
  it('should correctly parse CSV content with headers', async () => {
    const mockFile = createMockFile(mockCSV);

    const result = await readCSVFile(mockFile);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      userName: 'john.doe@example.com',
      emailActivity: 5,
      usbActivity: 0,
      cloudActivity: 3,
      managerAction: 'KnownGoodActivity'
    });
    expect(result[1].managerAction).toBe('Escalated');
  });
});




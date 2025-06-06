import { getActivityDataByDate } from '@/utils/GlobalHelpers';

describe('getActivityDataByDate', () => {
  it('should correctly group and sum activities by date', () => {
    const sampleData = [
      { date: '01/06/2025', integration: 'si-email' },   // Interpreted as Jan 6 in logic
      { date: '01/06/2025', integration: 'si-cloud' },
      { date: '01/06/2025', integration: 'si-cloud' },
      { date: '02/06/2025', integration: 'si-email' },   // Interpreted as Feb 6
      { date: '02/06/2025', integration: 'si-usb' },
    ];

    const result = getActivityDataByDate(sampleData);

    expect(result).toEqual([
      {
        date: '06/01/2025',  // January 6
        emailCount: 1,
        usbCount: 0,
        cloudCount: 2,
      },
      {
        date: '06/02/2025',  // February 6
        emailCount: 1,
        usbCount: 1,
        cloudCount: 0,
      },
    ]);
  });
});

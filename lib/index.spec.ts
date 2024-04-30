import { promises as fs } from './index';

describe('test promises', () => {
  it('should have async functions in promises export', async () => {
    expect(fs).toHaveProperty('writeFile');
    expect(fs).toHaveProperty('readFile');

    await fs.writeFile('test.txt', 'Hello, World!');
    expect(await fs.readFile('test.txt')).toBe('Hello, World!');
  });
});

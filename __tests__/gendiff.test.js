import { readFileSync } from 'fs';
import genDiff from '../src';

const getPathToFixture = fileName => `__tests__/__fixtures__/${fileName}`;
const expected = readFileSync(getPathToFixture('expected'), 'utf8');

describe('Compare flat configs', () => {
  it('#JSON', () => {
    expect(genDiff(getPathToFixture('before.json'), getPathToFixture('after.json'))).toBe(expected);
  });

  it('#YAML', () => {
    expect(genDiff(getPathToFixture('before.yaml'), getPathToFixture('after.yaml'))).toBe(expected);
  });
});

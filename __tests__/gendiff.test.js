import fs from 'fs';
import genDiff from '../src';

const getPathToFixture = fileName => `__tests__/__fixtures__/${fileName}`;

describe('genDiff', () => {
  test('#compare flat configs', () => {
    const conf1 = getPathToFixture('before.json');
    const conf2 = getPathToFixture('after.json');
    const expected = fs.readFileSync(getPathToFixture('expected'), 'utf8');
    expect(genDiff(conf1, conf2)).toBe(expected);
  });
});

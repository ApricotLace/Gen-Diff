import { readFileSync } from 'fs';
import genDiff from '../src';

const getPathToFixture = fileName => `__tests__/__fixtures__/${fileName}`;
const expected = readFileSync(getPathToFixture('expected'), 'utf8');

describe('Compare flat configs', () => {
  it('#JSON', () => {
    const conf1 = getPathToFixture('before.json');
    const conf2 = getPathToFixture('after.json');
    expect(genDiff(conf1, conf2)).toBe(expected);
  });

  it('#YAML', () => {
    const conf1 = getPathToFixture('before.yaml');
    const conf2 = getPathToFixture('after.yaml');
    expect(genDiff(conf1, conf2)).toBe(expected);
  });
});

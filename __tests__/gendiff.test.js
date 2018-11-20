import { readFileSync } from 'fs';
import genDiff from '../src';

const getPathToFixture = fileName => `__tests__/__fixtures__/${fileName}`;

describe('Compare flat configs', () => {
  it('#JSON', () => {
    expect(genDiff(getPathToFixture('before.json'), getPathToFixture('after.json')))
      .toBe(readFileSync(getPathToFixture('expected'), 'utf8'));
  });

  it('#YAML', () => {
    expect(genDiff(getPathToFixture('before.yaml'), getPathToFixture('after.yaml')))
      .toBe(readFileSync(getPathToFixture('expected'), 'utf8'));
  });

  it('#INI', () => {
    expect(genDiff(getPathToFixture('before.ini'), getPathToFixture('after.ini')))
      .toBe(readFileSync(getPathToFixture('expected'), 'utf8'));
  });
});

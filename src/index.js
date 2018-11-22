import { readFileSync } from 'fs';
import { extname } from 'path';
import buildAst from './astBuilder';
import parse from './parsers';
import render from './renderers/index';

export default (firstFile, secondFile, format = 'default') => {
  const obj1 = parse(extname(firstFile), readFileSync(firstFile, 'utf8'));
  const obj2 = parse(extname(secondFile), readFileSync(secondFile, 'utf8'));
  const buildedAst = buildAst(obj1, obj2);
  return render(format)(buildedAst);
};

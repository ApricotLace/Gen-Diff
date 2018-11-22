import { readFileSync } from 'fs';
import { extname } from 'path';
import buildAst from './astBuilder';
import parse from './parsers';
import render from './render';

export default (firstFile, secondFile) => {
  const obj1 = parse(extname(firstFile), readFileSync(firstFile, 'utf8'));
  const obj2 = parse(extname(secondFile), readFileSync(secondFile, 'utf8'));
  const buildedAst = buildAst(obj1, obj2);
  return render(buildedAst);
};

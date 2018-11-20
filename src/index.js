import { readFileSync } from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import parse from './parsers';

const stageActions = [
  {
    stage: 'unchanged',
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
    process: prop1 => ({ value: prop1 }),
  },
  {
    stage: 'changed',
    check: (obj1, obj2, key) => (_.has(obj1, key) && _.has(obj2, key)) && obj1[key] !== obj2[key],
    process: (prop1, prop2) => ({ oldValue: prop1, updValue: prop2 }),
  },
  {
    stage: 'removed',
    check: (obj1, obj2, key) => _.has(obj1, key) && !_.has(obj2, key),
    process: prop1 => ({ value: prop1 }),
  },
  {
    stage: 'added',
    check: (obj1, obj2, key) => !_.has(obj1, key) && _.has(obj2, key),
    process: (prop1, prop2) => ({ value: prop2 }),
  }];

const buildAst = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  return keys.map((key) => {
    const { stage, process } = stageActions.find(({ check }) => check(obj1, obj2, key));
    return { key, stage, ...process(obj1[key], obj2[key]) };
  });
};

const renderActions = [
  {
    check: node => node.stage === 'unchanged',
    makeDiffStr: node => `    ${node.key}: ${node.value}`,
  },
  {
    check: node => node.stage === 'changed',
    makeDiffStr: node => `  + ${node.key}: ${node.updValue}\n  - ${node.key}: ${node.oldValue}`,
  },
  {
    check: node => node.stage === 'removed',
    makeDiffStr: node => `  - ${node.key}: ${node.value}`,
  },
  {
    check: node => node.stage === 'added',
    makeDiffStr: node => `  + ${node.key}: ${node.value}`,
  }];

const render = (ast) => {
  const diff = ast.map((node) => {
    const { makeDiffStr } = renderActions.find(({ check }) => check(node));
    return makeDiffStr(node);
  }).join('\n');
  return `{\n${diff}\n}`;
};

export default (firstFile, secondFile) => {
  const obj1 = parse(extname(firstFile), readFileSync(firstFile, 'utf8'));
  const obj2 = parse(extname(secondFile), readFileSync(secondFile, 'utf8'));
  const buildedAst = buildAst(obj1, obj2);
  return render(buildedAst);
};

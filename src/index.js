import { readFileSync } from 'fs';
import _ from 'lodash';

const convertToObj = path => JSON.parse(readFileSync(path, 'utf8'));

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
  const keys = Array.from((new Set(Object.keys(obj1).concat(Object.keys(obj2)))));
  return keys.map((key) => {
    const { stage, process } = stageActions.find(({ check }) => check(obj1, obj2, key));
    return { key, stage, ...process(obj1[key], obj2[key]) };
  });
};

const renderActions = [
  {
    check: node => node.stage === 'unchanged',
    makeDiffStr: node => `    ${node.key}: ${node.value}\n`,
  },
  {
    check: node => node.stage === 'changed',
    makeDiffStr: node => `  + ${node.key}: ${node.updValue}\n  - ${node.key}: ${node.oldValue}\n`,
  },
  {
    check: node => node.stage === 'removed',
    makeDiffStr: node => `  - ${node.key}: ${node.value}\n`,
  },
  {
    check: node => node.stage === 'added',
    makeDiffStr: node => `  + ${node.key}: ${node.value}\n`,
  }];

const render = (ast) => {
  const diff = ast.map((node) => {
    const { makeDiffStr } = renderActions.find(({ check }) => check(node));
    return makeDiffStr(node);
  }).join('');
  return `{\n${diff}}`;
};

export default (firstFile, secondFile) => {
  const obj1 = convertToObj(firstFile);
  const obj2 = convertToObj(secondFile);
  const buildedAst = buildAst(obj1, obj2);
  return render(buildedAst);
};

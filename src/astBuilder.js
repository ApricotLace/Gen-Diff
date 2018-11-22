import _ from 'lodash';

const stageActions = [
  {
    stage: 'nested',
    check: (obj1, obj2, key) => obj1[key] instanceof Object && obj2[key] instanceof Object,
    process: (prop1, prop2, buildFunction) => ({ children: buildFunction(prop1, prop2) }),
  },
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
    return { key, stage, ...process(obj1[key], obj2[key], buildAst) };
  });
};

export default buildAst;

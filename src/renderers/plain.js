const makeDiffSubStr = (
  key, stage, prevProperties, content = '',
) => `Property ${prevProperties}${key} was ${stage}${content}`;

const quotesWrapper = value => ((typeof value === 'string') ? `'${value}'` : `${value}`);
const makeValue = value => ((typeof value === 'object') ? '[complex value]' : quotesWrapper(value));
const renderActions = [
  {
    check: node => node.stage === 'nested',
    makeDiff: (node, prevProps, fn) => fn(node.childrens, `${node.key}.`),
  },
  {
    check: node => node.stage === 'unchanged',
    makeDiff: (node, prevProps) => makeDiffSubStr(node.key, node.stage, prevProps),
  },
  {
    check: node => node.stage === 'changed',
    makeDiff: (node, prevProps) => makeDiffSubStr(
      node.key, node.stage, prevProps, `. From ${makeValue(node.oldValue)} to ${makeValue(node.updValue)}`,
    ),
  },
  {
    check: node => node.stage === 'removed',
    makeDiff: (node, prevProps) => makeDiffSubStr(node.key, node.stage, prevProps),
  },
  {
    check: node => node.stage === 'added',
    makeDiff: (node, prevProps) => makeDiffSubStr(
      node.key, node.stage, prevProps, ` with value ${makeValue(node.value)}`,
    ),
  }];

const render = (ast, prevProps = '') => {
  const diff = ast.map((node) => {
    const { makeDiff } = renderActions.find(({ check }) => check(node));
    return makeDiff(node, prevProps, render);
  }).join('\n');
  return diff;
};

export default render;

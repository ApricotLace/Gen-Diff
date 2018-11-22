const makeDiffSubStr = (
  key, stage, prevProperties, content = '',
) => `Property ${prevProperties}${key} was ${stage}${content}`;

const quotesWrapper = value => ((typeof value === 'string') ? `'${value}'` : `${value}`);
const makeValue = value => ((typeof value === 'object') ? '[complex value]' : quotesWrapper(value));

const renderActions = {
  nested: (node, prevProps, fn) => fn(node.children, `${node.key}.`),
  unchanged: (node, prevProps) => makeDiffSubStr(node.key, node.stage, prevProps),
  changed: (node, prevProps) => makeDiffSubStr(
    node.key, node.stage, prevProps, `. From ${makeValue(node.oldValue)} to ${makeValue(node.updValue)}`,
  ),
  removed: (node, prevProps) => makeDiffSubStr(node.key, node.stage, prevProps),
  added: (node, prevProps) => makeDiffSubStr(
    node.key, node.stage, prevProps, ` with value ${makeValue(node.value)}`,
  ),
};

const render = (ast, prevProps = '') => {
  const diff = ast.map(node => renderActions[node.stage](node, prevProps, render)).join('\n');
  return diff;
};

export default render;

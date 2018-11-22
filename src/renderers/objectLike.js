const defaultSpacesValue = 4;

const stringify = (value, spaces) => {
  if (!(typeof value === 'object')) {
    return value;
  }
  const updSpaces = spaces + defaultSpacesValue;
  const keys = Object.keys(value);
  const content = keys.map(key => `${' '.repeat(updSpaces)}${key}: ${stringify(value[key], updSpaces)}`).join('\n');
  return `{\n${content}\n${' '.repeat(spaces)}}`;
};

const makeDiffSubStr = (spaces, sign, key, value) => `${' '.repeat(spaces - 2)}${sign} ${key}: ${stringify(value, spaces)}`;

const renderActions = {
  nested: (node, spaces, fn, updDepth) => `${' '.repeat(spaces)}${node.key}: ${fn(node.children, updDepth)}`,
  unchanged: (node, spaces) => makeDiffSubStr(spaces, ' ', node.key, node.value),
  changed: (node, spaces) => [
    makeDiffSubStr(spaces, '-', node.key, node.oldValue),
    makeDiffSubStr(spaces, '+', node.key, node.updValue),
  ],
  removed: (node, spaces) => makeDiffSubStr(spaces, '-', node.key, node.value),
  added: (node, spaces) => makeDiffSubStr(spaces, '+', node.key, node.value),
};

const render = (ast, currentDepth = 1) => {
  const spaces = defaultSpacesValue * currentDepth;
  const updatedDepthValue = currentDepth + 1;
  const diff = ast.map(
    node => renderActions[node.stage](node, spaces, render, updatedDepthValue),
  ).flat().join('\n');
  return `{\n${diff}\n${' '.repeat(spaces - defaultSpacesValue)}}`;
};

export default render;

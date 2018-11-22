import renderDefault from './default';
import renderPlain from './plain';

const renderersObj = {
  default: renderDefault,
  plain: renderPlain,
  json: ast => JSON.stringify(ast, null, '   '),
};

export default format => renderersObj[format];

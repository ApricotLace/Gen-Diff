import renderObjectLike from './objectLike';
import renderPlain from './plain';

const renderersObj = {
  objectLike: renderObjectLike,
  plain: renderPlain,
  json: ast => JSON.stringify(ast, null, '   '),
};

export default format => renderersObj[format];

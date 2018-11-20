import { safeLoad } from 'js-yaml';
import { decode } from 'ini';

const parsersObj = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.ini': decode,
};

export default (fileExtension, file) => {
  const parse = parsersObj[fileExtension];
  return parse(file);
};

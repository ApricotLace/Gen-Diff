import { safeLoad } from 'js-yaml';

const parsersObj = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
};

export default (fileExtension, file) => {
  const pickedParser = parsersObj[fileExtension];
  return pickedParser(file);
};

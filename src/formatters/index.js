import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
  json: (ast) => JSON.stringify(ast, null, 2),
};

const chooseFormatter = (format) => formatters[format];

export default chooseFormatter;

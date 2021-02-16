import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

const chooseFormatter = (format) => formatters[format];

export default chooseFormatter;

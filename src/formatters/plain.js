import _ from 'lodash';

const buildValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return _.isString(value) ? `'${value}'` : value;
};

const events = {
  added: (path, value) => `Property '${path}' was added with value: ${buildValue(value)}`,
  deleted: (path) => `Property '${path}' was removed`,
  changed: (path, value) => {
    const { oldValue, newValue } = value;
    return `Property '${path}' was updated. From ${buildValue(oldValue)} to ${buildValue(newValue)}`;
  },
};

const render = (ast) => {
  const iter = (tree, pathItems) => tree.flatMap((node) => {
    const { key, type, value } = node;
    const newPathItems = [...pathItems, key];
    if (type === 'nested') {
      return iter(value, newPathItems);
    }
    const fullPath = newPathItems.join('.');
    const buildDescriptionProperty = _.get(events, type, null);
    return buildDescriptionProperty ? buildDescriptionProperty(fullPath, value) : null;
  });

  const propertys = iter(ast, []);
  const filteredPropertys = propertys.filter((p) => p);
  return filteredPropertys.join('\n');
};

export default render;

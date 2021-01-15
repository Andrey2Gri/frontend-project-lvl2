import yaml from 'js-yaml';

const mapping = {
  json: JSON.parse,
  yaml: yaml.load,
  yml: yaml.load,
};

export default (data, type) => {
  const parse = mapping[type];
  return parse(data);
};

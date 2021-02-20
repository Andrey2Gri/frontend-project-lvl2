import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('gendiff --format stylish (default)', () => {
  const pathToJson1 = getFixturePath('before.json');
  const pathToJson2 = getFixturePath('after.json');
  const resultDefault = readFile('result-default');
  const actualJson = gendiff(pathToJson1, pathToJson2);
  expect(actualJson).toBe(resultDefault);

  const pathToYml1 = getFixturePath('before.yml');
  const pathToYml2 = getFixturePath('after.yml');
  const actualYml = gendiff(pathToYml1, pathToYml2);
  expect(actualYml).toBe(resultDefault);
});

test('gendiff --format plain', () => {
  const pathToJson1 = getFixturePath('before.json');
  const pathToJson2 = getFixturePath('after.json');
  const resultPlain = readFile('result-plain');
  const actualJson = gendiff(pathToJson1, pathToJson2, 'plain');
  expect(actualJson).toBe(resultPlain);

  const pathToYml1 = getFixturePath('before.yml');
  const pathToYml2 = getFixturePath('after.yml');
  const actualYml = gendiff(pathToYml1, pathToYml2, 'plain');
  expect(actualYml).toBe(resultPlain);
});

test('gendiff --format json', () => {
  const pathToJson1 = getFixturePath('before.json');
  const pathToJson2 = getFixturePath('after.json');
  const resultJson = readFile('result-json');
  const actualJson = gendiff(pathToJson1, pathToJson2, 'json');
  expect(actualJson).toBe(resultJson);

  const pathToYml1 = getFixturePath('before.yml');
  const pathToYml2 = getFixturePath('after.yml');
  const actualYml = gendiff(pathToYml1, pathToYml2, 'json');
  expect(actualYml).toBe(resultJson);
});

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let expected;

beforeAll(() => {
  expected = readFile('expected');
});

test('gendiff', () => {
  const pathToJson1 = getFixturePath('file1.json');
  const pathToJson2 = getFixturePath('file2.json');
  const actualJson = gendiff(pathToJson1, pathToJson2);
  expect(actualJson).toBe(expected);

  const pathToYml1 = getFixturePath('file1.yml');
  const pathToYml2 = getFixturePath('file2.yml');
  const actualYml = gendiff(pathToYml1, pathToYml2);
  expect(actualYml).toBe(expected);
});

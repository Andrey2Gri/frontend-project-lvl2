import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (pathFile) => {
    const fullPath = path.resolve(pathFile);
    const data = fs.readFileSync(fullPath, 'utf8');
    return data;
};

const gendiff = (filepath1, filepath2) => {
    const data1 = readFile(filepath1);
    const data2 = readFile(filepath2);

    const parsedData1 = JSON.parse(data1);
    const parsedData2 = JSON.parse(data2);

    const keys = _.union(_.keys(parsedData1), _.keys(parsedData2));
    const result = {};

    for (const key of keys) {
        if (!_.has(parsedData1, key)) {
            result[`+ ${key}`] = parsedData2[key];
        } else if (!_.has(parsedData2, key)) {
            result[`- ${key}`] = parsedData1[key];
        } else if (parsedData1[key] !== parsedData2[key]) {
            result[`- ${key}`] = parsedData1[key];
            result[`+ ${key}`] = parsedData2[key];
        } else {
            result[`${key}`] = parsedData1[key];
        }
    }

    return JSON.stringify(result);
};

export default gendiff;
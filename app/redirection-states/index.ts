import { readFile, writeFile } from "fs/promises";

const filePath = './redirect-map.json';
let redirectionMap:any = {};

const isEmptyObject = (object: any) => {
    try {
        return Object.keys(object).length > 0;
    } catch (__) {
        return false;
    }
}

const loadInMemory = async () => {
    if (isEmptyObject(redirectionMap)) {
        return;
    }
    try {
    const map = await readFile(filePath, { encoding: 'utf-8'});
    const jsonMap = JSON.parse(map);
    redirectionMap = jsonMap;
    } catch (_) {
        console.log(_);
    }
}

const saveAsServerState = async (jsonMap: any) => {
    const jsonString = JSON.stringify(jsonMap);
    await writeFile(filePath, jsonString, {encoding: 'utf-8'});
}

const set = async (key: string, value: string) => {
    await loadInMemory();
    redirectionMap[key] = value;
    saveAsServerState(redirectionMap);
}

const get = async (key: string) => {
    await loadInMemory();
    return redirectionMap[key];
}

const isExist = async (key: string) => {
    await loadInMemory();
    return key in redirectionMap;
}

const getKeys = async () => {
    await loadInMemory();
    return Object(redirectionMap).keys();
}

const remove = async (key: string) => {
    await loadInMemory();
    delete redirectionMap[key];
    saveAsServerState(redirectionMap);
}

const allOperation = {
    set,
    get,
    isExist,
    getKeys,
    remove,
}

export default allOperation;

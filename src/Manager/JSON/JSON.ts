import fs from 'fs';
import DatabaseError from '../Error/Error';

export default class DataBase {
    #fileName: string;
    #nestedEnabled: boolean;
    #separator: string;

    constructor(fileName: string = 'database.json', nestedEnabled: boolean = true, separator: string = '..') {
        this.#fileName = fileName;
        this.#nestedEnabled = nestedEnabled;
        this.#separator = separator;

        const lastIndex = this.#fileName.lastIndexOf('/');
        const databaseDir = this.#fileName.substring(0, lastIndex);

        if (!fs.existsSync(databaseDir) && databaseDir) fs.mkdirSync(databaseDir, { recursive: true });
        if (!fs.existsSync(this.#fileName)) fs.writeFileSync(this.#fileName, "{}");
    }

    /**
     * Sets a key-value pair in the database.
     * @param {any} key Key to set.
     * @param {string} value Value to set.
     * @param {boolean} [nestedEnabled] Enable nested keys.
     * @param {string} [separator] Separator for nested keys.
     * @example db.set("name", "John Doe");
     */
    set(key: string, value: any, nestedEnabled: Boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject[part]) currentObject[part] = {};
                else if (typeof currentObject[part] !== 'object') throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            currentObject[lastPart] = value;
        } else {
            file[key] = value;
        }

        fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }

    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.get("name");
    */
    get(key: string, nestedEnabled: Boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentValue = file;
            for (const part of keyParts) {
                if (!currentValue.hasOwnProperty(part)) return undefined;
                currentValue = currentValue[part];
            }

            return currentValue;
        } else {
            return file[key];
        }
    }

    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.fetch("name");
    */
    fetch(key: string, nestedEnabled: Boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        return this.get(key, nestedEnabled, separator)
    }

    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example db.delete("name");
     */
    delete(key: string, nestedEnabled: Boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentValue = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentValue.hasOwnProperty(part)) return false;
                currentValue = currentValue[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            if (currentValue.hasOwnProperty(lastPart)) {
                delete currentValue[lastPart];
                fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return true;
            } else return false;
        } else {
            if (file.hasOwnProperty(key)) {
                delete file[key];
                fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return true;
            } else return false;
        }
    }

    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the key exists, otherwise false.
     * @example db.has("name");
     */
    has(key: string, nestedEnabled: Boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        if (this.get(key, nestedEnabled, separator)) return true;
        else return false;
    }

    /**
     * Adds a numeric value to an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to add the value to.
     * @param {number} value - Numeric value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.add("score", 10);
     */
    async add(key: string, value: number, nestedEnabled: boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject.hasOwnProperty(part)) {
                    currentObject[part] = {};
                } else if (typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            if (!currentObject[lastPart])
                currentObject[lastPart] = +value;
            else if (typeof currentObject[lastPart] === 'number')
                currentObject[lastPart] += value;
            else
                throw new DatabaseError(`Cannot add a number to a non-numeric value at key '${key}'`);
        } else {
            if (!file.hasOwnProperty(key))
                file[key] = +value;
            else if (typeof file[key] !== 'number')
                throw new DatabaseError(`Cannot add a number to a non-numeric value at key '${key}'`);
            else
                file[key] += value;
        }

        fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }

    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.subtract("score", 5);
     */
    subtract(key: string, value: number, nestedEnabled: boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");
        if (typeof value !== 'number') throw new DatabaseError("The value must be a number!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject.hasOwnProperty(part)) {
                    currentObject[part] = {};
                } else if (typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            if (!currentObject[lastPart])
                currentObject[lastPart] = -value;
            else if (typeof currentObject[lastPart] === 'number')
                currentObject[lastPart] -= value;
            else
                throw new DatabaseError(`Cannot add a number to a non-numeric value at key '${key}'`);
        } else {
            if (!file.hasOwnProperty(key))
                file[key] = -value;
            else if (typeof file[key] !== 'number')
                throw new DatabaseError(`Cannot add a number to a non-numeric value at key '${key}'`);
            else
                file[key] -= value;
        }

        fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }

    /**
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.push("myArray", "new element");
     */
    push(key: string, value: any, nestedEnabled: boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        if (nestedEnabled) {
            const keyParts = key.split(separator);

            let currentObject = file;
            for (let i = 0; i < keyParts.length - 1; i++) {
                const part = keyParts[i];
                if (!currentObject.hasOwnProperty(part)) {
                    currentObject[part] = {};
                } else if (typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot create property '${part}' on ${typeof currentObject[part]}`);
                }
                currentObject = currentObject[part];
            }

            const lastPart = keyParts[keyParts.length - 1];
            if (!currentObject || typeof currentObject !== 'object') {
                throw new DatabaseError(`Cannot push to a non-array value at key '${key}'`);
            }

            if (!currentObject[lastPart]) {
                currentObject[lastPart] = [];
            } else if (!Array.isArray(currentObject[lastPart])) {
                throw new DatabaseError(`Cannot push to a non-array value at key '${key}'`);
            }

            currentObject[lastPart].push(value);
        } else {
            if (!file.hasOwnProperty(key)) {
                file[key] = [value];
            } else {
                if (!Array.isArray(file[key])) {
                    throw new DatabaseError(`Cannot push to a non-array value at key '${key}'`);
                }
                file[key].push(value);
            }
        }

        fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
    }

    /**
     * Removes elements from an array associated with the provided key in the database based on a callback function or a specific value.
    * @param {string} key - Key of the array to pull from.
    * @param {any} callbackOrValue - Callback function or value to remove from the array.
    * @param {boolean} [pullAll=false] - If true, removes all elements that match the condition.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {boolean} - Returns true if any elements were removed, otherwise false.
    * @example db.pull("myArray", (element) => element > 10);
    */
    pull(key: string, callbackOrValue: any, pullAll: boolean = false, nestedEnabled: boolean = this.#nestedEnabled, separator: string = this.#separator) {
        if (!key) throw new DatabaseError("The key is not defined!");
        if (typeof key !== 'string') throw new DatabaseError("The key must be a string!");

        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        const traverseAndPull = (currentObject: any, keyParts: string[], depth: number): boolean => {
            const part = keyParts[depth];

            if (depth === keyParts.length - 1) {
                if (!currentObject.hasOwnProperty(part) || !Array.isArray(currentObject[part])) {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }

                const array = currentObject[part];
                let removed = false;

                if (pullAll) {
                    const indexesToRemove = array.reduce((acc: number[], element: any, index: number) => {
                        if (typeof callbackOrValue === 'function') {
                            const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;
                            if (callback(element, index, array)) {
                                acc.push(index);
                            }
                        } else {
                            const value = callbackOrValue;
                            if (element === value) {
                                acc.push(index);
                            }
                        }
                        return acc;
                    }, []);

                    if (indexesToRemove.length > 0) {
                        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                            array.splice(indexesToRemove[i], 1);
                        }
                        removed = true;
                    }
                } else {
                    const index = array.indexOf(callbackOrValue);
                    if (index !== -1) {
                        array.splice(index, 1);
                        removed = true;
                    }
                }

                if (removed) {
                    fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                }
                return removed;
            } else {
                if (!currentObject.hasOwnProperty(part) || typeof currentObject[part] !== 'object') {
                    throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
                }

                const updated = traverseAndPull(currentObject[part], keyParts, depth + 1);

                if (updated) fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
                return updated;
            }
        };

        if (nestedEnabled) {
            const keyParts = key.split(separator);
            return traverseAndPull(file, keyParts, 0);
        } else {
            if (!file.hasOwnProperty(key) || !Array.isArray(file[key])) {
                throw new DatabaseError(`Cannot pull from a non-array value at key '${key}'`);
            }

            const array = file[key];
            let removed = false;

            if (pullAll) {
                const indexesToRemove = array.reduce((acc: number[], element: any, index: number) => {
                    if (typeof callbackOrValue === 'function') {
                        const callback = callbackOrValue as (element: any, index: number, array: any[]) => boolean;
                        if (callback(element, index, array)) {
                            acc.push(index);
                        }
                    } else {
                        const value = callbackOrValue;
                        if (element === value) {
                            acc.push(index);
                        }
                    }
                    return acc;
                }, []);

                if (indexesToRemove.length > 0) {
                    for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                        array.splice(indexesToRemove[i], 1);
                    }
                    removed = true;
                }
            } else {
                const index = array.indexOf(callbackOrValue);
                if (index !== -1) {
                    array.splice(index, 1);
                    removed = true;
                }
            }

            if (removed) {
                fs.writeFileSync(this.#fileName, JSON.stringify(file, null, 2));
            }
            return removed;
        }
    }

    /**
     * Retrieves all key-value pairs from the database.
    * @returns {Array} - An array containing objects with the ID (key) and data (value).
    * @example db.all();
    */
    all() {
        const fileContent = fs.readFileSync(this.#fileName, "utf8");
        const file = fileContent ? JSON.parse(fileContent) : {};

        const keys = Object.keys(file);
        const result = [];

        for (const key of keys) {
            result.push({ ID: key, data: file[key] });
        }

        return result;
    }

    /**
     * Resets the entire database, removing all key-value pairs.
    * @example db.reset();
    */
    reset() {
        return fs.writeFileSync(this.#fileName, JSON.stringify({}, null, 2));
    }

}
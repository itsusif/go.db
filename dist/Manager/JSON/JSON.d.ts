export default class DataBase {
    #private;
    constructor(fileName?: string, nestedEnabled?: boolean, separator?: string);
    /**
     * Sets a key-value pair in the database.
     * @param {any} key Key to set.
     * @param {string} value Value to set.
     * @param {boolean} [nestedEnabled] Enable nested keys.
     * @param {string} [separator] Separator for nested keys.
     * @example db.set("name", "John Doe");
     */
    set(key: string, value: any, nestedEnabled?: Boolean, separator?: string): void;
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.get("name");
    */
    get(key: string, nestedEnabled?: Boolean, separator?: string): any;
    /**
     * Gets the value associated with the provided key from the database.
    * @param {string} key - Key to retrieve.
    * @param {boolean} [nestedEnabled] - Enable nested keys.
    * @param {string} [separator] - Separator for nested keys.
    * @returns {any} - The value associated with the key.
    * @example db.fetch("name");
    */
    fetch(key: string, nestedEnabled?: Boolean, separator?: string): any;
    /**
     * Deletes the value associated with the provided key from the database.
     * @param {string} key - Key to delete.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the value was successfully deleted, otherwise false.
     * @example db.delete("name");
     */
    delete(key: string, nestedEnabled?: Boolean, separator?: string): boolean;
    /**
     * Checks if a key exists in the database.
     * @param {string} key - Key to check.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @returns {boolean} - Returns true if the key exists, otherwise false.
     * @example db.has("name");
     */
    has(key: string, nestedEnabled?: Boolean, separator?: string): boolean;
    /**
     * Adds a numeric value to an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to add the value to.
     * @param {number} value - Numeric value to add.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.add("score", 10);
     */
    add(key: string, value: number, nestedEnabled?: boolean, separator?: string): Promise<void>;
    /**
     * Subtracts a numeric value from an existing value in the database. If the key does not exist, it will be created.
     * @param {string} key - Key to subtract the value from.
     * @param {number} value - Numeric value to subtract.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.subtract("score", 5);
     */
    subtract(key: string, value: number, nestedEnabled?: boolean, separator?: string): void;
    /**
     * Pushes a value into an array associated with the provided key in the database. If the key does not exist, it will be created as an array.
     * @param {string} key - Key to push the value to.
     * @param {any} value - Value to push into the array.
     * @param {boolean} [nestedEnabled] - Enable nested keys.
     * @param {string} [separator] - Separator for nested keys.
     * @example db.push("myArray", "new element");
     */
    push(key: string, value: any, nestedEnabled?: boolean, separator?: string): void;
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
    pull(key: string, callbackOrValue: any, pullAll?: boolean, nestedEnabled?: boolean, separator?: string): boolean;
    /**
     * Retrieves all key-value pairs from the database.
    * @returns {Array} - An array containing objects with the ID (key) and data (value).
    * @example db.all();
    */
    all(): {
        ID: string;
        data: any;
    }[];
    /**
     * Resets the entire database, removing all key-value pairs.
    * @example db.reset();
    */
    reset(): void;
}

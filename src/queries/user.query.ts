
import {IQuery} from "./IQuery";

export class UserQuery implements IQuery<string[], [argument: string]> {

    constructor() {}

    execute(argument: string) {
        return []
    }

    validate(argument: string): boolean {
        return true;
    }

}
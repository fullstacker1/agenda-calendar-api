import { regularExps } from "../../../config/regexp";

export class RegisterRouterDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterRouterDto?] {

        const { name, email, password } = object;

        if (!name) return ['Name is requireds', undefined];

        if (!email) return ['Email is required', undefined];

        if (!regularExps.email.test(email)) return ['Email is invalid'];

        if (!password) return ['Password is required', undefined];

        if (password.length < 6) return ['Password must be at least 6 characters long', undefined];

        return [undefined, new RegisterRouterDto(name, email, password)];

    }

}
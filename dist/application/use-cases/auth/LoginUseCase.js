import { AppError } from '../../../shared/errors/AppError.js';
import { UserMapper } from '../../mappers/auth/UserMapper.js';
export class LoginUseCase {
    users;
    passwords;
    tokens;
    constructor(users, passwords, tokens) {
        this.users = users;
        this.passwords = passwords;
        this.tokens = tokens;
    }
    async execute(input) {
        const email = input.email.trim().toLowerCase();
        const user = await this.users.findByEmail(email);
        if (!user || !(await this.passwords.compare(input.password, user.passwordHash))) {
            throw new AppError('Invalid email or password', 401);
        }
        return {
            user: UserMapper.toAuthenticatedUser(user),
            accessToken: await this.tokens.sign({ sub: user.id, role: user.role }),
            rememberMe: input.rememberMe ?? false,
        };
    }
}

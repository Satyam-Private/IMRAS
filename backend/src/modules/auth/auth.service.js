import * as userRepo from '../../repositories/user.repo.js';
import { verifyPassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';

export const login = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);

    if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    if (!user.is_active) {
        const err = new Error('User is inactive');
        err.status = 403;
        throw err;
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const token = signToken({
        user_id: user.user_id,
        role: user.role,
        warehouse_id: user.warehouse_id
    });

    return {
        token,
        user: {
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            warehouse_id: user.warehouse_id
        }
    };
};

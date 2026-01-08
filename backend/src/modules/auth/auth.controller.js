import * as authService from './auth.service.js';

export const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res) => {
    res.json({
        message: 'Logout successful. Please discard the token on client side.'
    });
};

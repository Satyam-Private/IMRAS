import * as movementService from './movement.service.js';
// import * as issueService from './issue.service.js';
export const issueStock = async (req, res, next) => {
    try {
        await movementService.issueStock(req.body, req.user.user_id);
        res.status(201).json({ message: 'Stock issued successfully' });
    } catch (err) {
        next(err);
    }
};

export const getPendingIssues = async (req, res, next) => {
    try {
        const issues = await movementService.getPendingIssues();
        res.json(issues);
    } catch (err) {
        next(err);
    }
};
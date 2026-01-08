export const transferStock = async (req, res, next) => {
    try {
        await movementService.transferStock(req.body, req.user.user_id);
        res.status(201).json({ message: 'Stock transferred successfully' });
    } catch (err) {
        next(err);
    }
};

export const warehouseAccess = () => {
    return async (req, res, next) => {
        try {
            const { role, warehouse_id } = req.user;

            // ADMIN can access all warehouses
            if (role === 'ADMIN') {
                return next();
            }

            if (!warehouse_id) {
                return res.status(403).json({
                    message: 'No warehouse assigned to user'
                });
            }

            // Attach warehouse to request context
            req.context = {
                warehouse_id
            };

            next();
        } catch (err) {
            next(err);
        }
    };
};

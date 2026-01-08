import * as putawayService from './putaway.service.js';

export const getCompletedPutaways = async (req, res, next) => {
    try {
        const todayOnly = req.query.today === "true";

        const data = await putawayService.getCompletedPutaways(
            req.user.warehouse_id,
            todayOnly
        );

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};
export const getPendingPutawayTasks = async (req, res, next) => {
    try {
        const tasks = await putawayService.getPendingPutawayTasks(
            req.user.warehouse_id
        );

        res.json({ data: tasks });
    } catch (err) {
        next(err);
    }
};


export const completePutaway = async (req, res, next) => {
    try {
        await putawayService.completePutaway(
            req.params.id,
            req.body.location_id,
            req.user.user_id
        );

        res.json({ message: 'Putaway completed successfully' });
    } catch (err) {
        next(err);
    }
};


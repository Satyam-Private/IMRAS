import {
  fetchStockAgeing,
  fetchFastSlowMoving,
  fetchStockValuation
} from '../../repositories/reports.repo.js';

export const getStockAgeing = async (user, filters) => {
  return fetchStockAgeing(user, filters);
};

export const getFastSlowMoving = async (user, filters) => {
  return fetchFastSlowMoving(user, filters);
};

export const getStockValuation = async (user, filters) => {
  return fetchStockValuation(user, filters);
};

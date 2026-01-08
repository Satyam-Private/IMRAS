import * as dashboardRepo from '../../repositories/dashboard.repo.js';

export const getWarehouseDashboard = async () => {
  return dashboardRepo.getWarehouseKPIs();
};

export const fetchDashboardKPIs = async (user) => {
  return dashboardRepo.getKPIs(user);
};

export const fetchRecentTransactions = async (user) => {
  return dashboardRepo.getTransactions(user);
};

export const fetchWarehouseStaff = async (user) => {
  return dashboardRepo.getStaff(user);
};

export const fetchCriticalReorderItems = async (user) => {
  return dashboardRepo.getReorderItems(user);
};
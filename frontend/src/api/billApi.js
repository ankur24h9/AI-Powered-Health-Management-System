import api from "./axiosConfig";

// Get all bills
export const getAllBills = async () => {
  const response = await api.get("/bills");
  return response.data;
};

// Get bill by ID
export const getBillById = async (id) => {
  const response = await api.get(`/bills/${id}`);
  return response.data;
};

// Create bill
export const createBill = async (billData) => {
  const response = await api.post(
    "/bills",
    billData
  );
  return response.data;
};

// Update bill
export const updateBill = async (
  id,
  billData
) => {
  const response = await api.put(
    `/bills/${id}`,
    billData
  );
  return response.data;
};

// Delete bill
export const deleteBill = async (id) => {
  const response = await api.delete(
    `/bills/${id}`
  );
  return response.data;
};
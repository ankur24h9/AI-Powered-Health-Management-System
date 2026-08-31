import api from "./axiosConfig";

// Get all prescriptions
export const getAllPrescriptions = async () => {
  const response = await api.get("/prescriptions");
  return response.data;
};

// Get prescription by ID
export const getPrescriptionById = async (id) => {
  const response = await api.get(`/prescriptions/${id}`);
  return response.data;
};

// Create prescription
export const createPrescription = async (prescriptionData) => {
  const response = await api.post(
    "/prescriptions",
    prescriptionData
  );
  return response.data;
};

// Update prescription
export const updatePrescription = async (
  id,
  prescriptionData
) => {
  const response = await api.put(
    `/prescriptions/${id}`,
    prescriptionData
  );
  return response.data;
};

// Delete prescription
export const deletePrescription = async (id) => {
  const response = await api.delete(
    `/prescriptions/${id}`
  );
  return response.data;
};
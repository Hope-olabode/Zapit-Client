// src/services/surveyService.js
import api from "../api/axios";

export const createSurvey = async (surveyData) => {
  try {
    const response = await api.post("/surveys", surveyData);
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error.response?.data || { message: "Failed to create survey" };
  }
};

export const getAllSurveys = async () => {
  try {
    const response = await api.get("/surveys");
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error.response?.data || { message: "Failed to fetch surveys" };
  }
};

export const getSurveyById = async (id) => {
  try {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error.response?.data || { message: "Failed to fetch survey" };
  }
};

export const deleteSurvey = async (id) => {
  try {
    const response = await api.delete(`/surveys/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting survey:", error);
    throw error.response?.data || { message: "Failed to delete survey" };
  }
};

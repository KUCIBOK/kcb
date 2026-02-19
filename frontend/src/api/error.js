import apiClient from "../config/api.js";

export async function sendErrorReport(payload) {
    await apiClient.post("/api/report-error", payload);
}
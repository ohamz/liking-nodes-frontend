import axios from "axios";

const BACKEND_URL = "https://liking-nodes-backend-production.up.railway.app";
const api = axios.create({ baseURL: BACKEND_URL });

// Helper: Retry once, then reload if still fails, with function name in logs
const requestWithRetry = async (fn, functionName, ...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    console.error(`[API ERROR - First Attempt] [${functionName}]`, error);
    // Only retry on network/CORS errors
    if (
      error.isAxiosError &&
      (!error.response || error.message === "Network Error")
    ) {
      try {
        console.warn(`[API RETRY] Retrying request after error... [${functionName}]`);
        return await fn(...args);
      } catch (retryError) {
        console.error(`[API ERROR - Retry Failed] [${functionName}]`, retryError);
        console.warn(`[API] Reloading page due to persistent error. [${functionName}]`);
        window.location.reload();
        throw retryError;
      }
    }
    throw error;
  }
};

export const fetchNodes = async () =>
  requestWithRetry(async () => {
    const response = await api.get("/nodes/");
    return response.data;
  }, "fetchNodes");

export const fetchLinks = async () =>
  requestWithRetry(async () => {
    const response = await api.get("/links/");
    return response.data;
  }, "fetchLinks");

export const addNode = async (color, sourceId) =>
  requestWithRetry(async () => {
    const response = await api.post("/nodes", {
      color,
      source: sourceId,
    });
    return response.data;
  }, "addNode");

export const likeNodesBatch = async (likeData) =>
  requestWithRetry(async () => {
    const response = await api.put("/nodes/batch/like", {
      likes: likeData,
    });
    return response.data;
  }, "likeNodesBatch");

// ! Not used anymore, batching likes is more efficient !
export const likeNode = async (nodeId) =>
  requestWithRetry(async () => {
    const response = await api.put(`/nodes/${nodeId}/like`);
    return response.data;
  }, "likeNode");

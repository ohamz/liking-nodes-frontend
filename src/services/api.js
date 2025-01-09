import axios from "axios";

const BACKEND_URL = "https://liking-nodes-backend-production.up.railway.app";
const api = axios.create({ baseURL: BACKEND_URL });

export const fetchNodes = async () => {
  try {
    const response = await api.get("/nodes/");
    return response.data;
  } catch (error) {
    console.error("Error while fetching nodes", error);
    throw new Error(`Failed to fetch nodes: ${error.message}`);
  }
};

export const fetchLinks = async () => {
  try {
    const response = await api.get("/links/");
    return response.data;
  } catch (error) {
    console.error("Error while fetching links", error);
    throw new Error(`Failed to fetch links: ${error.message}`);
  }
};

export const addNode = async (color, sourceId) => {
  try {
    const response = await api.post("/nodes", {
      color,
      source: sourceId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add node:", error.message);
    throw new Error("Failed to add node");
  }
};

export const likeNodesBatch = async (likeData) => {
  try {
    const response = await api.put("/nodes/batch/like", {
      likes: likeData,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to batch like nodes:", error.message);
    throw new Error("Failed to batch like nodes");
  }
};

// ! Not used anymore, batching likes is more efficient !
export const likeNode = async (nodeId) => {
  try {
    const response = await api.put(`/nodes/${nodeId}/like`);
    return response.data;
  } catch (error) {
    console.error("Failed to like node:", error.message);
    throw new Error("Failed to like node");
  }
};

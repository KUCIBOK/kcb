import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const ENTITY_API = `${API_URL}/api/entities`;

// ✅ Create entity
export const createEntity = async (entityData) => {
  try {
    const response = await axios.post(ENTITY_API, entityData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Get all entities
export const getEntities = async () => {
  try {
    const response = await axios.get(ENTITY_API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Get entity by ID
export const getEntityById = async (id) => {
  try {
    const response = await axios.get(`${ENTITY_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Update entity
export const updateEntity = async (id, updates) => {
  try {
    const response = await axios.put(`${ENTITY_API}/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Delete entity
export const deleteEntity = async (id) => {
  try {
    const response = await axios.delete(`${ENTITY_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Switch to entity
export const switchEntity = async (id) => {
  try {
    const response = await axios.post(`${ENTITY_API}/${id}/switch`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Add member
export const addMember = async (entityId, userId, role = "artist") => {
  try {
    const response = await axios.post(
      `${ENTITY_API}/${entityId}/members`,
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Update member role
export const updateMemberRole = async (entityId, memberId, role) => {
  try {
    const response = await axios.put(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Remove member
export const removeMember = async (entityId, memberId) => {
  try {
    const response = await axios.delete(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

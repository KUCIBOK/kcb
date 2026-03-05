import axios from "axios";
import { utils } from "./useAPI";

const ENTITY_API = `${utils.api}/entities`;

export const createEntity = async (entityData) => {
  try {
    const response = await axios.post(ENTITY_API, entityData, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getEntities = async () => {
  try {
    const response = await axios.get(ENTITY_API, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const getEntityById = async (id) => {
  try {
    const response = await axios.get(`${ENTITY_API}/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateEntity = async (id, updates) => {
  try {
    const response = await axios.put(`${ENTITY_API}/${id}`, updates, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const deleteEntity = async (id) => {
  try {
    const response = await axios.delete(`${ENTITY_API}/${id}`, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const switchEntity = async (id) => {
  try {
    const response = await axios.post(`${ENTITY_API}/${id}/switch`, {}, {
      headers: utils.options.headers,
    });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const addMember = async (entityId, userId, role = "artist") => {
  try {
    const response = await axios.post(
      `${ENTITY_API}/${entityId}/members`,
      { userId, role },
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const updateMemberRole = async (entityId, memberId, role) => {
  try {
    const response = await axios.put(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      { role },
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const removeMember = async (entityId, memberId) => {
  try {
    const response = await axios.delete(
      `${ENTITY_API}/${entityId}/members/${memberId}`,
      { headers: utils.options.headers }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

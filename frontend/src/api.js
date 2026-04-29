import axios from "axios";
import { supabase } from "./utils/supabase";

const API_BASE_URL = window.__API_BASE_URL__ || "http://127.0.0.1:8000";

// Set default headers for axios
axios.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}


export function validateIdea(idea) {
  return request("/validate-idea", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });
}

export function analyzeCompetitors(idea) {
  return request("/analyze-competitors", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });
}

export function generatePrd(productName, productDescription) {
  return request("/generate-prd", {
    method: "POST",
    body: JSON.stringify({
      product_name: productName,
      product_description: productDescription,
    }),
  });
}

export function generateGtmStrategy(product, audience, industry) {
  return request("/gtm-strategy", {
    method: "POST",
    body: JSON.stringify({ product, audience, industry }),
  });
}

export function getHealth() {
  return request("/health");
}

export async function generateIcpProfiles(product, industry) {
  try {
    const response = await axios.post(`${API_BASE_URL}/icp-builder`, {
      product,
      industry,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function generatePitchDeck(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/pitch-deck`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function generateColdEmail(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/cold-email`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function generateFinance(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/finance`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function generateLegal(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/legal`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function generateHiring(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/hiring`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Request failed"
    );
  }
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${API_BASE_URL}/rag/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Upload failed"
    );
  }
}

export async function chatWithRag(question, session_id = null) {
  try {
    const response = await axios.post(`${API_BASE_URL}/rag/chat`, {
      question,
      session_id,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Chat failed"
    );
  }
}

export async function listDocuments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/rag/documents`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Failed to list documents"
    );
  }
}

export async function deleteDocument(docId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/rag/documents/${docId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || error.message || "Failed to delete document"
    );
  }
}

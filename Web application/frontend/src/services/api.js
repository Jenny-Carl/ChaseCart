// api.js - Service API pour connecter le frontend à votre backend + robot
import { getBackendApiUrl, getRobotApiUrl } from "../utils/baseURL";

const API_BASE_URL = `${getBackendApiUrl()}/api`;

// Configuration par défaut pour les requêtes
const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Fonction utilitaire pour gérer les réponses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ============================================================================
// PRODUCTS API  (FULL CRUD)
// ============================================================================

export const productsApi = {
  // Récupérer tous les produits
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        ...defaultOptions,
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "GET",
        ...defaultOptions,
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les produits par catégorie
  getByCategory: async (category) => {
    try {
      console.log(`[API] Fetching products for category: ${category}`);
      console.log(`[API] URL: ${API_BASE_URL}/products/category/${category}`);
      const response = await fetch(`${API_BASE_URL}/products/category/${category}`, {
        method: "GET",
        ...defaultOptions,
      });
      console.log(`[API] Response status: ${response.status}`);
      const data = await handleResponse(response);
      console.log(`[API] Received data:`, data);
      return data.data;
    } catch (error) {
      console.error(`[API] Error fetching products for category ${category}:`, error);
      throw error;
    }
  },

  // Rechercher des produits
  search: async (searchTerm) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search/${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          ...defaultOptions,
        }
      );
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error(`Error searching products for "${searchTerm}":`, error);
      throw error;
    }
  },

  // Créer un nouveau produit (admin)
  create: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(productData),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Mettre à jour un produit (admin)
  update: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        ...defaultOptions,
        body: JSON.stringify(productData),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un produit (admin)
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        ...defaultOptions,
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// ============================================================================
// API DE SANTÉ ET STATUS BACKEND
// ============================================================================

export const healthApi = {
  check: async () => {
    try {
      const response = await fetch(`${getBackendApiUrl()}/health`, {
        method: "GET",
        ...defaultOptions,
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error checking server health:", error);
      throw error;
    }
  },

  getStatus: async () => {
    try {
      const response = await fetch(`${getBackendApiUrl()}/status`, {
        method: "GET",
        ...defaultOptions,
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error getting server status:", error);
      throw error;
    }
  },
};

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================
export const getProducts = async () => {
  return await productsApi.getAll();
};

// ============================================================================
// CART → ROBOT 
// ============================================================================

export const cartApi = {
  sendToRobot: async (items) => {
    try {
      const BACKEND_URL = getBackendApiUrl(); 

      const response = await fetch(`${BACKEND_URL}/robot/go-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Network error" }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Robot response:", data);
      return data;
    } catch (error) {
      console.error("Error sending cart to robot:", error);
      throw error;
    }
  },
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default {
  products: productsApi,
  health: healthApi,
  getProducts,
  robot: cartApi,
};

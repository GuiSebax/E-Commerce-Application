import { Product } from "@/types/product";
import axios from "axios";
import { useEffect, useState } from "react";
import { handleApiError } from "@/utils/errorHandler";

const API_URL = "http://localhost:5000/api/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getAllProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Product[]>(API_URL);
      setProducts(response.data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Product>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Product) => {
    setLoading(true);
    setError(null);

    try {
      const config = getToken();
      const response = await axios.post<Product>(API_URL, product, config);
      setProducts((prevProducts) => [...prevProducts, response.data]);

      return response.data;
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, updatedData: Partial<Product>) => {
    setLoading(true);
    setError(null);

    try {
      const config = getToken();
      const response = await axios.put<Product>(
        `${API_URL}/${id}`,
        updatedData,
        config
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? response.data : product
        )
      );
      return response.data;
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const config = getToken();
      await axios.delete(`${API_URL}/${id}`, config);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      return true;
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return {
    products,
    loading,
    error,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

import {
  ApiResponse,
  Product,
  Category,
  Subcategory,
  Brand,
  CartResponseData,
  CartResponse,
  Order,
  CheckoutSessionResponse,
  DeleteBillResponse,
} from "@/interfaces";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

function getTokenHeader(token: string) {
  return { token }; 
}

async function handleResponse(res: Response) {
  const text = await res.text();

  if (!text) {
    if (!res.ok) throw new Error("API returned an error with no body");
    return null;
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok || data.statusMsg === "fail") {
    console.error("API Error:", data);
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}


export async function getUserProfile(token: string) {
  const res = await fetch(`${BASE_URL}/users/getMe`, {
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
}



export const getProducts = async (): Promise<ApiResponse<Product>> => {
  const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
  return handleResponse(res);
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, { cache: "no-store" });
  return handleResponse(res);
};

export const getProductsByBrand = async (
  brandId: string
): Promise<ApiResponse<Product>> => {
  const res = await fetch(`${BASE_URL}/products?brand=${brandId}`, {
    cache: "no-store",
  });
  return handleResponse(res);
};

export const getProductsByCategory = async (
  categoryId: string
): Promise<ApiResponse<Product>> => {
  const res = await fetch(`${BASE_URL}/products?category=${categoryId}`, {
    cache: "no-store",
  });
  return handleResponse(res);
};



export const getUserWishlist = async (token: string) => {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
};

export const addToWishlist = async (token: string, productId: string) => {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader(token) },
    body: JSON.stringify({ productId }),
  });
  return handleResponse(res);
};

export const removeFromWishlist = async (token: string, productId: string) => {
  const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: getTokenHeader(token),
  });
  return handleResponse(res);
};



export const getCategories = async (): Promise<ApiResponse<Category>> => {
  const res = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
  return handleResponse(res);
};

export const getSubcategories = async (
  categoryId: string
): Promise<ApiResponse<Subcategory> | []> => {
  const res = await fetch(
    `${BASE_URL}/categories/${categoryId}/subcategories`,
    { cache: "no-store" }
  );
  const text = await res.text();
  if (!text) return [];
  return JSON.parse(text) as ApiResponse<Subcategory>;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, { cache: "no-store" });
  return handleResponse(res);
};

export const getProductsBySubcategory = async (subId: string) => {
  const res = await fetch(
    `${BASE_URL}/products?subcategory=${subId}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data || [];
};

export const getBrands = async (): Promise<ApiResponse<Brand>> => {
  const res = await fetch(`${BASE_URL}/brands`, { cache: "no-store" });
  return handleResponse(res);
};

export const getBrandById = async (id: string): Promise<Brand> => {
  const res = await fetch(`${BASE_URL}/brands/${id}`, { cache: "no-store" });
  return handleResponse(res);
};


export const getUserCart = async (token: string): Promise<CartResponse> => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "GET",
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
};

export const addToCart = async (
  token: string,
  productId: string,
  quantity: number
): Promise<CartResponseData> => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader(token) },
    body: JSON.stringify({ productId, count: quantity }),
  });
  return handleResponse(res);
};
export async function removeCartItem(token: string, itemId: string) {
  const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
    method: "DELETE",
    headers: getTokenHeader(token),
  });
  return res.json(); 
}

export async function updateCartItem(token: string, itemId: string, count: number) {
  const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getTokenHeader(token),
    },
    body: JSON.stringify({ count }), 
  });
  return res.json(); 
}

export const clearCart = async (token: string): Promise<CartResponseData> => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "DELETE",
    headers: getTokenHeader(token),
  });
  return handleResponse(res);
};



export const getAllOrders = async (token: string): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
};

export const getUserOrders = async (
  userId: string,
  token: string
): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders/user/${userId}`, {
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
};

export async function createCashOrder(
  token: string,
  cartId: string,
  addressId: string
) {
  const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader(token) },
    body: JSON.stringify({ shippingAddress: addressId }),
  });
  return handleResponse(res);
}

export async function createCheckoutSession(
  token: string,
  cartId: string,
  returnUrl: string
): Promise<CheckoutSessionResponse> {
  const res = await fetch(
    `${BASE_URL}/orders/checkout-session/${cartId}?url=${returnUrl}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getTokenHeader(token) },
    }
  );
  return handleResponse(res);
}

export async function deleteBill(
  token: string,
  orderId: string
): Promise<DeleteBillResponse> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "DELETE",
    headers: getTokenHeader(token),
  });
  return handleResponse(res);
}



export const addAddress = async (
  token: string,
  address: { name: string; details: string; phone: string; city: string }
) => {
  const res = await fetch(`${BASE_URL}/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader(token) },
    body: JSON.stringify(address),
  });
  return handleResponse(res);
};

export const getUserAddresses = async (token: string) => {
  const res = await fetch(`${BASE_URL}/addresses`, {
    headers: getTokenHeader(token),
    cache: "no-store",
  });
  return handleResponse(res);
};

export const getAddressById = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/addresses/${id}`, {
    headers: getTokenHeader(token),
  });
  return handleResponse(res);
};

export const removeAddress = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/addresses/${id}`, {
    method: "DELETE",
    headers: getTokenHeader(token),
  });
  return handleResponse(res);
};



export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}): Promise<any> => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    console.error("Login failed:", data);
    throw new Error(data.message || "Invalid credentials");
  }
  return data;
};

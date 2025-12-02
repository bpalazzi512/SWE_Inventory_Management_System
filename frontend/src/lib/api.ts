/**
 * API utility for making authenticated requests to the backend
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

// Optional API key for public (non-JWT) routes like login/register
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_KEY_HEADER = process.env.NEXT_PUBLIC_API_KEY_HEADER || "x-api-key";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean; // If true, will throw error if no token is found
  useApiKey?: boolean; // If true, include API key header when configured
  cache?: RequestCache;
}

/**
 * Makes an API request with automatic JWT token inclusion from localStorage
 * @param route - API route (e.g., "/products", "/users/123")
 * @param options - Request options
 * @returns Promise with parsed JSON response
 * @throws Error if request fails or if requireAuth is true and no token is found
 */
export async function apiRequest<T = unknown>(
  route: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    requireAuth = true,
    useApiKey = false,
    cache = "no-store",
  } = options;

  // Get token from localStorage (only in browser environment)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (requireAuth && !token) {
    throw new Error("Authentication required. Please log in.");
  }

  // Build headers
  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // Add Content-Type for requests with body
  if (body && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Add Authorization header if token exists
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Add API key for routes that should be protected by an API token instead of JWT
  if (useApiKey && API_KEY) {
    requestHeaders[API_KEY_HEADER] = API_KEY;
  }

  // Build URL
  const url = route.startsWith("http") ? route : `${API_BASE}${route}`;

  console.log(API_KEY, API_KEY_HEADER);

  // Make request
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  // Handle error responses
  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Parse and return response
  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      // If JSON parsing fails, return empty object
      return {} as T;
    }
  }

  // For non-JSON responses, return empty object
  return {} as T;
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = unknown>(route: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(route, { ...options, method: "GET" }),

  post: <T = unknown>(route: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(route, { ...options, method: "POST", body }),

  put: <T = unknown>(route: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(route, { ...options, method: "PUT", body }),

  delete: <T = unknown>(route: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(route, { ...options, method: "DELETE" }),

  patch: <T = unknown>(route: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(route, { ...options, method: "PATCH", body }),
};


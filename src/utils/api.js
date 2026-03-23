import { getToken, removeToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';


export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      removeToken();
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((data && data.message) || response.statusText || 'An error occurred during network request');
    }

    return data;
  } catch (error) {
    console.error(`API fetch error [${endpoint}]:`, error);
    throw error;
  }
}

export async function loginUser(email, password) {
  return fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, petName, password) {
  return fetchApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, petName, password }),
  });
}

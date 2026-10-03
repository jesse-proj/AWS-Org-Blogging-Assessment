export const TOKEN_STORAGE_KEY = 'blog_access_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } 

    else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update auth token storage:', err);
  }
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setToken(null);
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  return response;
}

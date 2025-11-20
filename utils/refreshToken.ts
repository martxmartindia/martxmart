
export async function refreshAccessToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export async function handleTokenExpiration(originalRequest: () => Promise<any>) {
  try {
    return await originalRequest();
  } catch (error: any) {
    if (error.message === 'Token expired') {
      // Try to refresh the token
      try {
        await refreshAccessToken();
        // Retry the original request with the new token
        return await originalRequest();
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }
    throw error;
  }
}
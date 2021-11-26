import { User } from './types/user';

const apiUrl = process.env.REACT_APP_API_URL;

interface ResponseData<T> {
  data: T | null;
  errno: number;
  message: string | null;
}

export const handleUserResponse = (res: ResponseData<User>) => {
  return res.data;
};

export const register = (param: { username: string; password: string }) => {
  return fetch(`${apiUrl}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  }).then(async (response) => {
    if (response.ok) {
      const res: ResponseData<User> = await response.json();
      if (res.errno === 0) {
        return handleUserResponse(res);
      } else {
        return Promise.reject(res);
      }
    } else {
      return Promise.reject(await response.json());
    }
  });
};

export const login = (param: { username: string; password: string }) => {
  return fetch(`${apiUrl}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  }).then(async (response) => {
    if (response.ok) {
      const res: ResponseData<User> = await response.json();
      if (res.errno === 0) {
        return handleUserResponse(res);
      } else {
        return Promise.reject(res);
      }
    } else {
      return Promise.reject(await response.json());
    }
  });
};

export const logout = () => {
  return fetch(`${apiUrl}/api/user/logout`).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    } else {
      return Promise.reject();
    }
  });
};

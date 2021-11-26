import qs from 'qs';

interface ResponseData {
  data: any;
  errno: number;
  message: string | null;
}

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  req?: object;
}

export const http = async (
  endpoint: string,
  { req, headers, ...customConfig }: Config
) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': req ? 'application/json' : '',
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(req)}`;
  } else {
    config.body = JSON.stringify(req || {});
  }

  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.ok) {
        const res: ResponseData = await response.json();
        if (res.errno === 0) {
          return res.data;
        } else {
          return Promise.reject(res.message);
        }
      } else {
        return Promise.reject(req);
      }
    });
};

export const useHttp = () => {
  return (endpoint: string, config: Config) => http(endpoint, config);
};

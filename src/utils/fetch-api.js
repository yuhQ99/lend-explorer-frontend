const hostApp = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CommonCall = async (api, header, config) => {
  const { isReturnError } = config;
  let headers = {
    'Content-Type': 'application/json',
  };

  if (header) {
    // override Content-type
    headers = {
      ...headers,
      ...header.headers,
    };
  }
  let head = { ...header, headers };
  let response = await fetch(api, head);
  if (response.status === 400 || response.status === 401) {
    const { message } = await response.json();
    throw new Error(message);
  }
  if (isReturnError) {
    return response.json();
  }
  if (response.status === 500 || response.status === 502 || response.status === 404 || response.status === 504) {
    throw new Error('Network request failed, please try again');
  }
  if (response.status === 422) {
    const { message } = await response.json();
    throw new Error(message);
  }
  return response.json();
}

export const FetchApi = {
  getDashboard: async (data) => {
    let header;
    let api;
    console.log(data);
    if (data.date) {
      header = {
        method: 'POST',
        body: JSON.stringify({
          date: data.date,
          user: data.user,
        }),
      };
      api = `${hostApp}/v1/current-position/snapshot`;
    } else {
      header = {
        method: 'GET',
      };
      api = `${hostApp}/v1/current-position?page=${data.page}&limit=${data.limit}&sortBy=${data.sortBy}`;
      if (data.user) {
        api += `&user=${data.user}`;
      }
    } 
    return CommonCall(api, header, {});
  },
  getCoinDetails: async (data) => {
    const header = {
      method: 'GET',
    };
    let api = `${hostApp}/v1/current-position/details?page=${data.page}&limit=${data.limit}&token=${data.token}&mode=${data.mode}`;
    if (data.sortBy) {
      api += `&sortBy=${data.sortBy}`;
    }
    return CommonCall(api, header, {});
  }
};

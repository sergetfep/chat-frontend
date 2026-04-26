const createRequest = async (options) => {
  const requestOptions = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (options.data) {
    requestOptions.body = JSON.stringify(options.data);
  }

  const response = await fetch(options.url, requestOptions);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || 'Request failed');
    error.status = response.status;
    error.response = result;
    throw error;
  }

  return result;
};

export default createRequest;
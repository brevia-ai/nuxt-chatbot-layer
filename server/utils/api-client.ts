import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { H3Event } from 'h3';

export const authorizationHeaders = (event: H3Event) => {
  return {
    Authorization: `Bearer ` + useRuntimeConfig(event).apiSecret,
  };
};

export const apiHeaders = (json_content = false, custom = {}, event: H3Event) => {
  const authHeader = authorizationHeaders(event);
  if (json_content) {
    return { ...authHeader, ...custom, ...{ 'Content-Type': 'application/json' } };
  }

  return { ...authHeader, ...custom };
};

export const apiUrl = (path = '', event: H3Event) => {
  const config = useRuntimeConfig(event);
  return `${config.apiBaseUrl}${path}`;
};

export const handleApiError = async (
  event: H3Event,
  error: AxiosError | any,
): Promise<ApiResponseBodyError> => {
  console.error('API error:', error);
  if (isAxiosError(error) && error?.response) {
    setResponseStatus(event, error.response.status);

    return error.response.data;
  }

  setResponseStatus(event, error?.status || 500);

  return { error: error?.message || 'Some error occured :(' };
};

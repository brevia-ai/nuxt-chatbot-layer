import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import type { H3Event } from 'h3';


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

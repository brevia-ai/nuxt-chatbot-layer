import { handleApiError } from "../../utils/api-error";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const url = config.apiBaseUrl + `/evaluate`;
  const body = await readBody(event);
  try {
    const response: any = await $fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (err: any) {
    console.log(err);
    return handleApiError(event, err);
  }
});

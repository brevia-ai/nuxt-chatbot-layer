export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const url = config.apiBaseUrl + `/chat_history`;
  const query = getQuery(event);

  try {
    const response: any = await $fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + config.apiSecret,
      },
      query,
    });

    return response;
  } catch (error) {
    return handleApiError(event, error);
  }
});

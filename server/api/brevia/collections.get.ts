export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  let url = config.apiBaseUrl + `/collections`;
  const query = getQuery(event);
  if (query.uuid) {
    url += `/${query.uuid}`;
    delete query.uuid;
  }
  try {
    const response: any = await $fetch(url, { query }, event);

    if ('name' in query && response.length > 0) {
      return response[0];
    }

    return response;
  } catch (error) {
    return handleApiError(event, error);
  }
});

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let url = '/collections';
  if (query.uuid) {
    url += `/${query.uuid}`;
    delete query.uuid;
  }
  console.log(apiUrl(url, event));
  try {
    const response: any = await $fetch(apiUrl(url, event), {
      headers: authorizationHeaders(event),
      query,
    });

    if ('name' in query && response.length > 0) {
      return response[0];
    }

    return response;
  } catch (err: any) {
    console.log(err);
    return { error: err?.message || 'Unknown error' };
  }
});

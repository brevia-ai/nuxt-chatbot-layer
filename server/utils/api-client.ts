import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import { H3Event } from 'h3';

async function loadModule(path: string) {
  try{
    const module = await import( /* @vite-ignore */path);
    return module;
  }catch(err){
    //console.error(err);
    return undefined;
  }

}

export const apiBaseUrl = (event: H3Event, project: string | null = null): string => {
  const config = useRuntimeConfig(event);
  if (!project) {
    return config.apiBaseUrl;
  }

  const URL = config.projects?.[project]?.apiBaseUrl;
  if (!URL) {
    throw new Error(`API base URL not set in project "${project}"`);
  }
  return URL;
};

export const authorizationHeaders = (event: H3Event, project: string | null = null) => {
  return {
    Authorization: `Bearer ` + apiSecret(event, project),
  };
};

export const apiHeaders = (json_content = false, custom = {}, event: H3Event, project: string | null = null) => {
  const authHeader = authorizationHeaders(event, project);
  if (json_content) {
    return { ...authHeader, ...custom, ...{ 'Content-Type': 'application/json' } };
  }

  return { ...authHeader, ...custom };
};

export const apiUrl = ( event: H3Event, path = '', project: string | null = null) => {
  return `${apiBaseUrl(event, project)}${path}`;
};

export const apiSecret = (event: H3Event, project: string | null = null): string | null => {
  const config = useRuntimeConfig(event);

  return project ? config.projects?.[project]?.apiSecret || null : config.apiSecret;
};

export const apiFetch = async (path: string, options: any, event: H3Event) => {
  const currentProject = loadModule('./project');
  const project = await currentProject.then(m => (m)?m.currentProject(event):null);
  const headers = options.headers || {};
  const authHeader = authorizationHeaders(event, project);
  options.headers = { ...headers, ...authHeader };
  const url = apiUrl(event, path, project);
  return $fetch(url, options);
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

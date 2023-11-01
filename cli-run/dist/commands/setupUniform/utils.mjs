// src/commands/setupUniform/api.ts
import fetch from "node-fetch";
var getIntegrationDefinitionByDisplayName = async (params) => {
  const { displayName, teamId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/integration-definitions", apiHost);
  url.searchParams.append("teamId", teamId);
  url.searchParams.append("includePublic", "false");
  url.searchParams.append("teamSpecificType", "true");
  const availableIntegrationsResult = await fetch(url, {
    headers
  }).then((res) => res.json());
  const availableIntegrations = availableIntegrationsResult?.results;
  if (!Array.isArray(availableIntegrations))
    return;
  return availableIntegrations.find((integration) => integration.displayName === displayName);
};
var defineIntegration = async (params) => {
  const { data, teamId, apiHost = "https://uniform.app", headers } = params;
  const body = {
    teamId,
    data
  };
  const url = new URL("/api/v1/integration-definitions", apiHost);
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  const result = response;
  if (result?.displayName === data.displayName) {
    return result;
  }
};
var getInstalledIntegration = async (params) => {
  const { projectId, type, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/integration-installations", apiHost);
  url.searchParams.append("projectId", projectId);
  url.searchParams.append("type", type);
  url.searchParams.append("exactType", "true");
  url.searchParams.append("teamSpecificType", "true");
  const installedIntegrationResult = await fetch(url, {
    headers
  }).then((res) => res.json());
  const installedIntegrations = installedIntegrationResult?.results;
  if (Array.isArray(installedIntegrations) && installedIntegrations.length === 1)
    return installedIntegrations[0];
};
var installIntegration = async (params) => {
  const { data, projectId, type, apiHost = "https://uniform.app", headers } = params;
  const body = {
    projectId,
    exactType: true,
    type,
    data
  };
  const url = new URL("/api/v1/integration-installations", apiHost);
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  if (response.status !== 204) {
    const installResponse = await response.json();
    const errorMessage = installResponse?.errorMessage;
    throw new Error(`Unable to install integration: ${errorMessage}`);
  }
  return getInstalledIntegration({ projectId, type, headers, apiHost });
};
var getDataSource = async (params) => {
  const { projectId, dataSourceId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/data-source", apiHost);
  url.searchParams.append("projectId", projectId);
  url.searchParams.append("dataSourceId", dataSourceId);
  const response = await fetch(url, {
    headers
  }).then((res) => res.json());
  return response?.result;
};
var addDataSource = async (params) => {
  const {
    teamId,
    projectId,
    integrationDisplayName,
    connectorType,
    baseUrl,
    dataSourceDisplayName,
    dataSourceId,
    dataProperties,
    apiHost = "https://uniform.app",
    headers
  } = params;
  const integrationDefinition = await getIntegrationDefinitionByDisplayName({
    displayName: integrationDisplayName,
    teamId,
    apiHost,
    headers
  });
  if (!integrationDefinition) {
    throw new Error(`Unable to find the integration definition: ${integrationDisplayName}.`);
  }
  const body = {
    projectId,
    integrationType: integrationDefinition.type,
    data: {
      id: dataSourceId,
      displayName: dataSourceDisplayName,
      connectorType,
      baseUrl,
      ...dataProperties
    }
  };
  const url = new URL("/api/v1/data-source", apiHost);
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  if (response.status !== 204) {
    const addResponse = await response.json();
    const errorMessage = addResponse?.errorMessage;
    throw new Error(`Unable to add ${integrationDisplayName} data source: ${errorMessage}`);
  }
  return getDataSource({ projectId, dataSourceId, apiHost, headers });
};

// src/commands/setupUniform/utils.ts
var configureIntegration = async ({
  displayName,
  teamId,
  projectId,
  integrationParams,
  fetchIntegrationParamsFn,
  customManifest,
  apiHost,
  headers
}) => {
  if (customManifest) {
    await defineIntegration({
      data: customManifest,
      teamId,
      apiHost,
      headers
    });
  }
  const integration = await getIntegrationDefinitionByDisplayName({
    displayName,
    teamId,
    apiHost,
    headers
  });
  if (!integration) {
    throw new Error(`Integration definition is not available: ${displayName}`);
  }
  const installedIntegration = await getInstalledIntegration({
    projectId,
    type: integration.type,
    apiHost,
    headers
  });
  if (installedIntegration) {
    return;
  }
  const dynamicIntegrationParams = await fetchIntegrationParamsFn?.({ apiHost });
  const newInstalledIntegration = await installIntegration({
    projectId,
    type: integration.type,
    data: dynamicIntegrationParams || integrationParams,
    apiHost,
    headers
  });
  if (!newInstalledIntegration) {
    return;
  }
};
var configureDataSource = async ({
  teamId,
  projectId,
  integrationDisplayName,
  headers,
  connectorType,
  baseUrl,
  dataSourceDisplayName,
  dataSourceId,
  dataProperties,
  apiHost
}) => {
  const dataSource = await getDataSource({
    projectId,
    dataSourceId,
    headers,
    apiHost
  });
  if (dataSource) {
    return;
  }
  await addDataSource({
    teamId,
    projectId,
    integrationDisplayName,
    headers,
    connectorType,
    baseUrl,
    dataSourceDisplayName,
    dataSourceId,
    dataProperties,
    apiHost
  });
};
export {
  configureDataSource,
  configureIntegration
};

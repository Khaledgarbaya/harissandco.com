// src/commands/setupUniform/api.ts
import fetch from "node-fetch";

// src/uniform/index.ts
var WRITE_PERMISSIONS = [
  "PROJECT",
  "UPM_SCHEMA",
  "UPM_READ",
  "UPM_PUB",
  "UPM_CREATE",
  "UPM_WRITE",
  "UPM_DELETE",
  "UPM_PUBLISH",
  "OPT_READ",
  "OPT_CREATE_ENRICHMENTS",
  "OPT_WRITE_ENRICHMENTS",
  "OPT_DELETE_ENRICHMENTS",
  "OPT_CREATE_INTENTS",
  "OPT_WRITE_INTENTS",
  "OPT_DELETE_INTENTS",
  "OPT_PUB",
  "OPT_PUBLISH",
  "OPT_CREATE_QUIRKS",
  "OPT_WRITE_QUIRKS",
  "OPT_DELETE_QUIRKS",
  "OPT_CREATE_SIGNALS",
  "OPT_WRITE_SIGNALS",
  "OPT_DELETE_SIGNALS",
  "OPT_CREATE_TESTS",
  "OPT_WRITE_TESTS",
  "OPT_DELETE_TESTS",
  "RDT_UPDATE",
  "RDT_CREATE",
  "RDT_DELETE",
  "UPM_DATACONN",
  "UPM_DATATYPE",
  "PRM_SCHEMA"
];
var makeApiKey = (teamId, projectId, name, permissions) => ({
  name,
  teamId,
  projects: [
    {
      projectId,
      permissions,
      roles: [],
      useCustom: true
    }
  ],
  email: "",
  identity_subject: "",
  isAdmin: false
});
var makeWriteApiKey = (teamId, projectId) => makeApiKey(teamId, projectId, "Created by Demos CLI (write)", WRITE_PERMISSIONS);

// src/commands/setupUniform/api.ts
var createUniformProject = async (params) => {
  const { apiHost, teamId, headers, projectName, previewUrl, projectTypeId } = params;
  const url = new URL("/api/v1/project", apiHost);
  const body = {
    name: projectName,
    projectTypeId,
    teamId,
    previewUrl
  };
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  const installResponse = await response.json();
  if (response.status !== 200) {
    const errorMessage = installResponse?.errorMessage;
    throw new Error(`Unable to create project: ${errorMessage}`);
  }
  return {
    id: installResponse?.id
  };
};
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
var createApiKeys = async (params) => {
  const { teamId, projectId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/members", apiHost);
  const writeApiKeyResponse = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(makeWriteApiKey(teamId, projectId))
  }).then((res) => res.json());
  return {
    writeApiKey: writeApiKeyResponse.apiKey
  };
};
var createUniformTeam = async (params) => {
  const { name, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/team", apiHost);
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ name })
  }).then((res) => res.json());
  return {
    id: response?.id
  };
};
export {
  addDataSource,
  createApiKeys,
  createUniformProject,
  createUniformTeam,
  defineIntegration,
  getDataSource,
  getInstalledIntegration,
  getIntegrationDefinitionByDisplayName,
  installIntegration
};

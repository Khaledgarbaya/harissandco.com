interface ConfigureIntegration {
    displayName: string;
    teamId: string;
    projectId: string;
    integrationParams?: Record<string, string>;
    fetchIntegrationParamsFn?: (data?: object) => Promise<Record<string, string | object>>;
    customManifest?: Record<string, unknown>;
    apiHost: string;
    headers: Record<string, string>;
}
interface ConfigureDataSource {
    teamId: string;
    projectId: string;
    integrationDisplayName: string;
    headers: Record<string, string>;
    connectorType: string;
    baseUrl: string;
    dataSourceDisplayName: string;
    dataSourceId: string;
    dataProperties: Record<string, unknown>;
    apiHost: string;
}
declare const configureIntegration: ({ displayName, teamId, projectId, integrationParams, fetchIntegrationParamsFn, customManifest, apiHost, headers, }: ConfigureIntegration) => Promise<void>;
declare const configureDataSource: ({ teamId, projectId, integrationDisplayName, headers, connectorType, baseUrl, dataSourceDisplayName, dataSourceId, dataProperties, apiHost, }: ConfigureDataSource) => Promise<void>;

export { configureDataSource, configureIntegration };

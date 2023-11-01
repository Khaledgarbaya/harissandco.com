declare const createUniformProject: (params: UNIFORM_API.CreateUniformProjectParams) => Promise<{
    id: string;
}>;
declare const getIntegrationDefinitionByDisplayName: (params: UNIFORM_API.IntegrationDefinitionParams) => Promise<{
    displayName: string;
    type: string;
} | undefined>;
declare const defineIntegration: (params: UNIFORM_API.DefineIntegrationParams) => Promise<UNIFORM_API.DefineResponse | undefined>;
declare const getInstalledIntegration: (params: UNIFORM_API.GetInstalledIntegrationsParams) => Promise<{
    displayName: string;
    type: string;
} | undefined>;
declare const installIntegration: (params: UNIFORM_API.InstallIntegrationsParams) => Promise<{
    displayName: string;
    type: string;
} | undefined>;
declare const getDataSource: (params: UNIFORM_API.GetDataSourceParams) => Promise<Record<string, string>>;
declare const addDataSource: (params: UNIFORM_API.AddDataSourceParams) => Promise<Record<string, string>>;
declare const createApiKeys: (params: UNIFORM_API.CreateApiKeysParams) => Promise<{
    writeApiKey: string;
}>;
declare const createUniformTeam: (params: UNIFORM_API.CreateUniformTeamParams) => Promise<{
    id: string;
}>;

export { addDataSource, createApiKeys, createUniformProject, createUniformTeam, defineIntegration, getDataSource, getInstalledIntegration, getIntegrationDefinitionByDisplayName, installIntegration };

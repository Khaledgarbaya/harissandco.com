declare const showDemoHeader: (project: string, variant: string) => void;
declare const askUniformAccessToken: (apiHost: string) => Promise<string | symbol>;
declare const getUniformTeam: (availableVariants: {
    value: string;
    label: string;
}[]) => Promise<string>;
declare const getUniformProject: (availableVariants: {
    value: string;
    label: string;
}[]) => Promise<string>;
declare const getUniformProjectName: () => Promise<string>;
declare const getUniformProjectTypeId: (projectTypes: UNIFORM_API.ProjectType[]) => Promise<string>;
declare const getUniformTeamName: () => Promise<string>;
declare const getProjectLocation: (exportRoot: string, message?: string) => Promise<string>;
declare const getUniformEnvs: (project: string) => Promise<{
    uniformApiKey: string;
    uniformProjectId: string;
    uniformCliBaseUrl: string;
    uniformEdgeApiHost: string;
}>;
declare const getUniformAccessTokenEnvs: () => Promise<{
    uniformCliBaseUrl: string;
    uniformEdgeApiHost: string;
    uniformAccessToken: string;
} | null>;
declare const getAlgoliaEnvs: (project: string) => Promise<{
    ALGOLIA_APPLICATION_ID: string;
    ALGOLIA_SEARCH_KEY: string;
}>;
declare const getCoveoEnvs: (project: string) => Promise<{
    NEXT_PUBLIC_COVEO_ORGANIZATION_ID: string;
    NEXT_PUBLIC_COVEO_API_KEY: string;
}>;
declare const getCommercetoolsEnvs: (project: string) => Promise<{
    COMMERCETOOLS_PROJECT_KEY: string;
    COMMERCETOOLS_CLIENT_ID: string;
    COMMERCETOOLS_CLIENT_SECRET: string;
    COMMERCETOOLS_API_URL: string;
    COMMERCETOOLS_AUTH_URL: string;
}>;
declare const getContentfulEnvs: (project: string) => Promise<{
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ENVIRONMENT: string;
    CONTENTFUL_CDA_ACCESS_TOKEN: string;
    CONTENTFUL_CPA_ACCESS_TOKEN: string;
}>;
declare const getSegmentEnvs: (project: string) => Promise<{
    NEXT_PUBLIC_ANALYTICS_WRITE_KEY: string;
    SEGMENT_SPACE_ID: string;
    SEGMENT_API_KEY: string;
}>;
declare const getGoogleAnalyticsEnvs: (project: string) => Promise<{
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
}>;
declare const additionalModulesForComponentStarterKit: ({ integrationList, packagesList }: {
    integrationList: CLI.Integration[];
    packagesList: string[];
}) => ({ progressSpinner, project, variant, projectPath, }: CLI.AdditionalModulesExecutorProps) => Promise<void>;

export { additionalModulesForComponentStarterKit, askUniformAccessToken, getAlgoliaEnvs, getCommercetoolsEnvs, getContentfulEnvs, getCoveoEnvs, getGoogleAnalyticsEnvs, getProjectLocation, getSegmentEnvs, getUniformAccessTokenEnvs, getUniformEnvs, getUniformProject, getUniformProjectName, getUniformProjectTypeId, getUniformTeam, getUniformTeamName, showDemoHeader };

declare const setupUniformProject: (params: UNIFORM_API.SetupUniformProject, progressSpinner: {
    start: (message: string) => void;
    stop: (message: string) => void;
}) => Promise<{
    uniformTeamId?: undefined;
    uniformProjectId?: undefined;
    uniformApiKey?: undefined;
    uniformHeaders?: undefined;
} | {
    uniformTeamId: string;
    uniformProjectId: string;
    uniformApiKey: string;
    uniformHeaders: {
        accept: string;
        authorization: string;
    };
}>;

export { setupUniformProject };

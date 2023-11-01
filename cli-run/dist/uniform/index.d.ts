declare const makeWriteApiKey: (teamId: string, projectId: string) => {
    name: string;
    teamId: string;
    projects: {
        projectId: string;
        permissions: string[];
        roles: never[];
        useCustom: boolean;
    }[];
    email: string;
    identity_subject: string;
    isAdmin: boolean;
};

export { makeWriteApiKey };

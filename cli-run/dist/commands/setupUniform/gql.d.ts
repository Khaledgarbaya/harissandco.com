declare const getAvailableTeams: (params: UNIFORM_API.GetTeamsParams) => Promise<{
    team: {
        name: string;
        id: string;
        sites: {
            name: string;
            id: string;
        }[];
    };
}[]>;

export { getAvailableTeams };

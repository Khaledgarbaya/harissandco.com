declare const openAIIntegration: {
    type: string;
    displayName: string;
    logoIconUrl: string;
    badgeIconUrl: string;
    category: string;
    baseLocationUrl: string;
    locations: {
        settings: {
            url: string;
        };
        canvas: {
            parameterTypes: {
                type: string;
                displayName: string;
                configureUrl: string;
                editorUrl: string;
                editorLocations: {
                    choices: {
                        url: string;
                    };
                };
                renderableInPropertyPanel: boolean;
            }[];
        };
    };
};

export { openAIIntegration as default };

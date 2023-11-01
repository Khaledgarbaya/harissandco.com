declare const commercetoolsIntegration: {
    type: string;
    displayName: string;
    logoIconUrl: string;
    badgeIconUrl: string;
    category: string;
    baseLocationUrl: string;
    locations: {
        install: {
            description: string[];
        };
        settings: {
            url: string;
        };
        canvas: {
            parameterTypes: ({
                type: string;
                displayName: string;
                configureUrl: string;
                editorUrl: string;
                renderableInPropertyPanel: boolean;
                editorLocations?: undefined;
            } | {
                type: string;
                displayName: string;
                configureUrl: string;
                editorUrl: string;
                editorLocations: {
                    'category-editor-dialog': {
                        url: string;
                    };
                };
                renderableInPropertyPanel: boolean;
            })[];
        };
    };
};

export { commercetoolsIntegration as default };

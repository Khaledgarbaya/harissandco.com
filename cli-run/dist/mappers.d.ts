declare const demosVariantsGetEnvsMap: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, (project: CLI.AvailableProjects, variant: CLI.CommonVariants) => Promise<Record<string, string>> | undefined>>;
};
declare const Integrations: {
    Cloudinary: {
        name: string;
        data: {
            cloudName: string;
            apiKey: string;
            apiSecret: string;
        };
    };
    Contentful: {
        name: string;
    };
    ContentfulClassic: {
        name: string;
        link: string;
    };
    Contentstack: {
        name: string;
    };
    ThemePackUniform: {
        name: string;
        fetchDataFn: (data: any) => Promise<{
            selectedThemeName: string;
            themes: {
                uniform: CLI.ThemePackTheme | undefined;
                javadrip: CLI.ThemePackTheme | undefined;
                custom: {
                    themeLabel: string;
                    themeName: string;
                    colors: {
                        label: string;
                        name: string;
                        value: string;
                    }[];
                };
            };
        }>;
    };
    ThemePackJavadrip: {
        name: string;
        fetchDataFn: (data: any) => Promise<{
            selectedThemeName: string;
            themes: {
                uniform: CLI.ThemePackTheme | undefined;
                javadrip: CLI.ThemePackTheme | undefined;
                custom: {
                    themeLabel: string;
                    themeName: string;
                    colors: {
                        label: string;
                        name: string;
                        value: string;
                    }[];
                };
            };
        }>;
    };
    ThemePackJavadripBlack: {
        name: string;
        fetchDataFn: (data: any) => Promise<{
            selectedThemeName: string;
            themes: {
                uniform: CLI.ThemePackTheme | undefined;
                javadrip: CLI.ThemePackTheme | undefined;
                custom: {
                    themeLabel: string;
                    themeName: string;
                    colors: {
                        label: string;
                        name: string;
                        value: string;
                    }[];
                };
            };
        }>;
    };
    UniformFakeCommerce: {
        name: string;
        data: {
            apiUrl: string;
        };
    };
    Algolia: {
        name: string;
        data: {
            applicationId: string | undefined;
            searchKey: string | undefined;
            indexName: string | undefined;
        };
    };
    Commercetools: {
        name: string;
        customManifest: {
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
        data: {
            projectKey: string | undefined;
            clientId: string | undefined;
            clientSecret: string | undefined;
            apiUrl: string | undefined;
            authUrl: string | undefined;
        };
    };
    Coveo: {
        name: string;
        data: {
            organizationId: string;
            apiKey: string;
        };
    };
    OpenAI: {
        name: string;
        customManifest: {
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
    };
};
declare const notMeshIntegrations: string[];
declare const demosPreviewUrlMap: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, string>>;
};
declare const demosRequiredIntegrationsMap: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, CLI.Integration[] | undefined>>;
};
declare const demosRequiredDataSourceMap: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, CLI.DataSourceConfiguration[] | undefined>>;
};
declare const demosVariantsRequiredLocales: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, string[]>>;
};
declare const demosVariantsModulesRequire: {
    [availableProjects in CLI.AvailableProjects]: Partial<Record<CLI.CommonVariants, (props: CLI.AdditionalModulesExecutorProps) => Promise<void> | undefined>>;
};

export { Integrations, demosPreviewUrlMap, demosRequiredDataSourceMap, demosRequiredIntegrationsMap, demosVariantsGetEnvsMap, demosVariantsModulesRequire, demosVariantsRequiredLocales, notMeshIntegrations };

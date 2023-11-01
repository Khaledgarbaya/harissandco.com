declare const isNodeModulesExist: (projectPath: string) => boolean;
declare const isMetaDataExist: () => boolean;
declare const parseMetadata: () => Promise<any>;
declare const isProjectExist: (projectPath: string) => boolean;
declare const parseEnvFile: (envFilePath: string) => Promise<Record<string, string>>;
declare const fillEnvFiles: (destination: string, apiKey: string, projectApi: string, uniformCliBaseUrl: string, uniformEdgeApiHost: string, additionalEnvData?: Record<string, string>) => Promise<void>;
declare const getExistDemoPath: (destination: string, project: string) => string;
declare const installDependencies: (projectPath: string) => Promise<unknown>;
declare const buildDemo: (projectPath: string) => Promise<unknown>;
declare const runDemo: (projectPath: string) => Buffer;
declare const runPush: (projectPath: string) => Promise<unknown>;
declare const installPackages: (projectPath: string, packages: string[]) => Promise<unknown>;
declare const fixEslint: (projectPath: string) => Promise<unknown>;

export { buildDemo, fillEnvFiles, fixEslint, getExistDemoPath, installDependencies, installPackages, isMetaDataExist, isNodeModulesExist, isProjectExist, parseEnvFile, parseMetadata, runDemo, runPush };

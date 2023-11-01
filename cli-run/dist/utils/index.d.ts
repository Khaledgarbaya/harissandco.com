import { AppModes } from '../constants.js';

declare const execPromise: (command: string) => Promise<unknown>;
declare const remove: (path: string) => Promise<void>;
declare const fetchThemePackThemes: (selectedThemeName: string, data: Record<string, string>) => Promise<{
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
declare const composeGetEnvFns: (...getEnvFunctions: ((project: CLI.AvailableProjects, variant: CLI.CommonVariants) => Promise<Record<string, string>>)[]) => (project: CLI.AvailableProjects, variant: CLI.CommonVariants) => Promise<{}>;
declare const addExamplesCanvasCache: (projectPath: string) => Promise<void>;
declare const scanPageDirectory: (projectPath: string, mode: AppModes) => Promise<boolean>;
declare const switchModeInPageDirectory: (projectPath: string, mode: AppModes, removalList?: string[]) => Promise<void>;

export { addExamplesCanvasCache, composeGetEnvFns, execPromise, fetchThemePackThemes, remove, scanPageDirectory, switchModeInPageDirectory };

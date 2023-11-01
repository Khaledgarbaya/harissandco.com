#! /usr/bin/env node

// src/index.ts
import "dotenv/config";
import clear from "clear";
import color2 from "picocolors";
import path4 from "path";

// src/promts.ts
import {
  select as baseSelect,
  text as baseText,
  confirm as baseConfirm,
  intro,
  note,
  outro,
  spinner,
  cancel,
  isCancel
} from "@clack/prompts";
var checkIsCancel = (value) => {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    return process.exit(0);
  }
};
var select = async (props) => {
  const selectedValue = await baseSelect(props);
  checkIsCancel(selectedValue);
  return selectedValue;
};
var text = async (props) => {
  const textValue = await baseText(props);
  checkIsCancel(textValue);
  return textValue;
};
var confirm = async (props) => {
  const textValue = await baseConfirm(props);
  checkIsCancel(textValue);
  return textValue;
};

// src/informationCollector.ts
import fs3 from "fs";
import path3 from "path";
import color from "picocolors";
import open from "open";

// src/utils/index.ts
import childProcess from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// src/customThemes.ts
var JavaDripBlackTheme = {
  themeLabel: "Custom",
  themeName: "custom",
  colors: [
    {
      label: "Primary",
      name: "primary",
      value: "#000000"
    },
    {
      label: "Primary Content",
      name: "primary-content",
      value: "#FFFFFF"
    },
    {
      label: "Secondary",
      name: "secondary",
      value: "#F7DF1E"
    },
    {
      label: "Secondary Content",
      name: "secondary-content",
      value: "#000000"
    },
    {
      label: "Accent",
      name: "accent",
      value: "#F8E399"
    },
    {
      label: "Accent Content",
      name: "accent-content",
      value: "#000000"
    },
    {
      label: "Info Content",
      name: "info-content",
      value: "#E4E4E4"
    },
    {
      label: "Base 200",
      name: "base-200",
      value: "#b69066"
    },
    {
      label: "Base 300",
      name: "base-300",
      value: "#000000"
    }
  ]
};

// src/utils/index.ts
var execPromise = (command) => {
  return new Promise(function(resolve, reject) {
    childProcess.exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
};
var remove = (path5) => fs.promises.rm(path5, { recursive: true, force: true });
var fetchThemePackThemes = async (selectedThemeName, data) => {
  const { apiHost = "" } = data || {};
  const baseUrl = apiHost.includes("canary") ? "https://canary-theme-pack-mesh-integration.netlify.app" : "https://theme-pack.mesh.uniform.app";
  const StaticThemes = await fetch(`${baseUrl}/staticThemes.json`).then((res) => res.json());
  const uniformTheme = StaticThemes.find((theme) => theme.themeName === "uniform");
  const javadripTheme = StaticThemes.find((theme) => theme.themeName === "javadrip");
  return {
    selectedThemeName,
    themes: {
      uniform: uniformTheme,
      javadrip: javadripTheme,
      custom: JavaDripBlackTheme
    }
  };
};
var composeGetEnvFns = (...getEnvFunctions) => async (project, variant) => {
  let envs = {};
  for (const fn of getEnvFunctions) {
    const result = await fn(project, variant);
    envs = { ...envs, ...result };
  }
  return envs;
};
var addExamplesCanvasCache = async (projectPath) => {
  const listOfCanvasCache = await fs.promises.readdir(path.resolve(projectPath, "content", "examples"));
  await Promise.all(
    listOfCanvasCache.map(async (cache) => {
      await fs.promises.cp(
        path.resolve(projectPath, "content", "examples", cache),
        path.resolve(projectPath, "content", cache),
        { recursive: true }
      );
    })
  );
  await remove(path.resolve(projectPath, "content", "examples"));
  const pathToCanvasFile = path.resolve(projectPath, "src", "canvas", "index.ts");
  const canvas = await fs.promises.readFile(pathToCanvasFile, "utf-8");
  await fs.promises.writeFile(pathToCanvasFile, `import '../modules/coveo';
${canvas}`);
};
var scanPageDirectory = async (projectPath, mode) => await findModeOptions(path.resolve(projectPath, "src", "pages"), mode) || await findModeOptions(path.resolve(projectPath, "src", "pages", "api"), mode);
var findModeOptions = async (projectPath, mode) => fs.promises.readdir(projectPath, { withFileTypes: true }).then((r) => r.some((node) => node.isFile() ? node.name.endsWith(mode) : false));
var switchModeInPageDirectory = async (projectPath, mode, removalList) => {
  await switchModeTo(path.resolve(projectPath, "src", "pages"), mode, removalList);
  await switchModeTo(path.resolve(projectPath, "src", "pages", "api"), mode, removalList);
};
var switchModeTo = async (projectPath, mode, removalList) => {
  const listOfFilesNames = (await fs.promises.readdir(projectPath, { withFileTypes: true })).filter((node) => node.isFile()).map((item) => item.name);
  for (const fileName of listOfFilesNames) {
    if (fileName.endsWith(mode)) {
      const destinationFileName = fileName.slice(0, -(mode.length + 1));
      await remove(path.resolve(projectPath, destinationFileName));
      await fs.promises.cp(path.resolve(projectPath, fileName), path.resolve(projectPath, destinationFileName));
      await remove(path.resolve(projectPath, fileName));
    } else if (fileName.endsWith("ssr" /* SSR */) || fileName.endsWith("ssg" /* SSG */) || removalList?.includes(fileName)) {
      await remove(path.resolve(projectPath, fileName));
    }
  }
};

// src/commands/run.ts
import fs2 from "fs";
import path2 from "path";
import os from "os";
import { execSync } from "child_process";
var isNodeModulesExist = (projectPath) => {
  return fs2.existsSync(path2.join(projectPath, "node_modules"));
};
var isMetaDataExist = () => {
  return fs2.existsSync(path2.resolve("", "metadata.txt"));
};
var parseMetadata = async () => {
  const metadata = await fs2.promises.readFile(path2.resolve("", "metadata.txt"), "utf-8");
  return JSON.parse(metadata);
};
var isProjectExist = (projectPath) => {
  return fs2.existsSync(projectPath);
};
var parseEnvFile = async (envFilePath) => {
  if (!fs2.existsSync(envFilePath)) {
    return {};
  }
  const envFileContent = await fs2.promises.readFile(envFilePath, "utf-8");
  const envFileLines = envFileContent.split("\n");
  return envFileLines.reduce((acc, line) => {
    if (line.trim() !== "" && line.indexOf("=") !== -1) {
      const parts = line.split("=");
      const key = parts[0].trim();
      const value = parts[1].trim();
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
};
var fillEnvFiles = async (destination, apiKey, projectApi, uniformCliBaseUrl, uniformEdgeApiHost, additionalEnvData) => {
  const envExampleContent = await parseEnvFile(path2.join(destination, ".env.example"));
  const additionalEnvs = additionalEnvData ? Object.entries(additionalEnvData).map(([key, value]) => `${key}=${value}`).join("\n") : "";
  fs2.writeFileSync(
    path2.join(destination, ".env"),
    `UNIFORM_API_KEY=${apiKey}
UNIFORM_PROJECT_ID=${projectApi}
UNIFORM_CLI_BASE_URL=${uniformCliBaseUrl}
UNIFORM_CLI_BASE_EDGE_URL=${uniformEdgeApiHost}
UNIFORM_PREVIEW_SECRET=${envExampleContent?.["UNIFORM_PREVIEW_SECRET"] || "javadrip"}
${additionalEnvs}`
  );
};
var getExistDemoPath = (destination, project) => {
  return path2.join(os.homedir(), destination, project);
};
var installDependencies = (projectPath) => {
  return execPromise(`cd ${projectPath} && npm install`);
};
var buildDemo = (projectPath) => {
  return execPromise(`cd ${projectPath} && npm run build`);
};
var runDemo = (projectPath) => {
  return execSync(`cd ${projectPath} && npm run start`, { stdio: "inherit" });
};
var runPush = (projectPath) => {
  return execPromise(`cd ${projectPath} && npm run uniform:push && npm run uniform:publish`);
};
var installPackages = (projectPath, packages) => {
  return execPromise(`cd ${projectPath} && npm i ${packages.join(" ")}`);
};
var fixEslint = (projectPath) => {
  return execPromise(`cd ${projectPath} && npm run lint:fix`);
};

// src/informationCollector.ts
var args = process.argv.slice(2);
var isDevMode = args.includes("--dev");
var validate = (value) => {
  if (!value || value?.trim().length === 0)
    return "This field is required";
};
var showDemoHeader = (project, variant) => {
  intro(color.bgCyan(`demos-run-cli ${project || ""} ${variant || ""}`));
};
var askUniformAccessToken = async (apiHost) => {
  const shouldContinue = await confirm({
    message: "Open a browser window to generate a Uniform access token?"
  });
  if (shouldContinue) {
    const url = new URL("cli-login", apiHost);
    await open(url.toString());
  }
  return text({
    message: "Paste your access token here and press enter (or just enter to quit):",
    validate(value) {
      if (value.length === 0)
        return;
    }
  });
};
var getUniformTeam = async (availableVariants) => {
  return (await select({
    message: `Please select your team:`,
    options: availableVariants
  })).toString();
};
var getUniformProject = async (availableVariants) => {
  return (await select({
    message: `Please select your project:`,
    options: availableVariants
  })).toString();
};
var getUniformProjectName = async () => {
  return (await text({
    message: `Please enter project name:`
  })).toString();
};
var getUniformProjectTypeId = async (projectTypes) => {
  const options = projectTypes.filter((type) => type.limit > type.used).map((type) => ({
    value: type.id,
    label: `${type.name}${type.is_prod !== true ? " [NON PROD]" : ""} (${type.limit - type.used} remaining)`
  }));
  return (await select({ message: "Select your Uniform project type:", options })).toString();
};
var getUniformTeamName = async () => {
  return (await text({
    message: `Please enter team name:`
  })).toString();
};
var getProjectLocation = async (exportRoot, message = "Where do your project located?") => {
  return (await text({ message, validate, initialValue: exportRoot })).toString();
};
var getUniformEnvs = async (project) => {
  const uniformApiKey = (await text({
    message: `Your ${project} uniform api key:`,
    validate
  })).toString();
  const uniformProjectId = (await text({
    message: `Your ${project} uniform project id:`,
    validate
  })).toString();
  const uniformCliBaseUrl = (await select({
    message: "Select Uniform host:",
    options: [
      { value: "https://uniform.app", label: "https://uniform.app" },
      { value: "https://canary.uniform.app", label: "https://canary.uniform.app" }
    ],
    initialValue: "https://uniform.app"
  })).toString();
  const uniformEdgeApiHost = uniformCliBaseUrl.includes("canary") ? "https://canary.uniform.global" : "https://uniform.global";
  return { uniformApiKey, uniformProjectId, uniformCliBaseUrl, uniformEdgeApiHost };
};
var getUniformAccessTokenEnvs = async () => {
  let uniformCliBaseUrl = (await select({
    message: "Select Uniform host:",
    options: [
      { value: "https://uniform.app", label: "https://uniform.app" },
      { value: "https://canary.uniform.app", label: "https://canary.uniform.app" },
      { value: "", label: "Other host" }
    ],
    initialValue: process.env.CLI_UNIFORM_CLI_BASE_URL || "https://uniform.app"
  })).toString();
  if (uniformCliBaseUrl === "") {
    uniformCliBaseUrl = (await text({
      message: `Your Uniform host:`,
      validate
    })).toString();
  }
  let uniformEdgeApiHost = "";
  if (uniformCliBaseUrl === "https://canary.uniform.app") {
    uniformEdgeApiHost = "https://canary.uniform.global";
  }
  if (uniformCliBaseUrl === "https://uniform.app") {
    uniformEdgeApiHost = "https://uniform.global";
  }
  uniformEdgeApiHost = (await text({
    message: `Your Uniform edge API host:`,
    initialValue: uniformEdgeApiHost,
    validate
  })).toString();
  const uniformAccessToken = await askUniformAccessToken(uniformCliBaseUrl);
  if (!uniformAccessToken)
    return null;
  return {
    uniformCliBaseUrl,
    uniformEdgeApiHost,
    uniformAccessToken: uniformAccessToken?.toString()
  };
};
var getAlgoliaEnvs = async (project) => {
  if (!isDevMode) {
    return {
      ALGOLIA_APPLICATION_ID: process.env.CLI_ALGOLIA_APPLICATION_ID || "",
      ALGOLIA_SEARCH_KEY: process.env.CLI_ALGOLIA_SEARCH_KEY || ""
    };
  }
  const ALGOLIA_APPLICATION_ID = (await text({
    message: `Your ${project} algolia application id:`,
    validate,
    initialValue: process.env.CLI_ALGOLIA_APPLICATION_ID || ""
  })).toString();
  const ALGOLIA_SEARCH_KEY = (await text({
    message: `Your ${project} algolia search key:`,
    validate,
    initialValue: process.env.CLI_ALGOLIA_SEARCH_KEY || ""
  })).toString();
  return { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY };
};
var getCoveoEnvs = async (project) => {
  if (!isDevMode) {
    return {
      NEXT_PUBLIC_COVEO_ORGANIZATION_ID: process.env.CLI_COVEO_ORGANIZATION_ID || "",
      NEXT_PUBLIC_COVEO_API_KEY: process.env.CLI_COVEO_API_KEY || ""
    };
  }
  const NEXT_PUBLIC_COVEO_ORGANIZATION_ID = (await text({
    message: `Your ${project} coveo organization id:`,
    validate,
    initialValue: process.env.CLI_COVEO_ORGANIZATION_ID || ""
  })).toString();
  const NEXT_PUBLIC_COVEO_API_KEY = (await text({
    message: `Your ${project} coveo api key:`,
    validate,
    initialValue: process.env.CLI_COVEO_API_KEY || ""
  })).toString();
  return { NEXT_PUBLIC_COVEO_ORGANIZATION_ID, NEXT_PUBLIC_COVEO_API_KEY };
};
var getCommercetoolsEnvs = async (project) => {
  if (!isDevMode) {
    return {
      COMMERCETOOLS_PROJECT_KEY: process.env.CLI_COMMERCETOOLS_PROJECT_KEY || "",
      COMMERCETOOLS_CLIENT_ID: process.env.CLI_COMMERCETOOLS_CLIENT_ID || "",
      COMMERCETOOLS_CLIENT_SECRET: process.env.CLI_COMMERCETOOLS_CLIENT_SECRET || "",
      COMMERCETOOLS_API_URL: process.env.CLI_COMMERCETOOLS_API_URL || "",
      COMMERCETOOLS_AUTH_URL: process.env.CLI_COMMERCETOOLS_AUTH_URL || ""
    };
  }
  const COMMERCETOOLS_PROJECT_KEY = (await text({
    message: `Your ${project} Commercetools project key:`,
    validate,
    initialValue: process.env.CLI_COMMERCETOOLS_PROJECT_KEY
  })).toString();
  const COMMERCETOOLS_CLIENT_ID = (await text({
    message: `Your ${project} Commercetools client id:`,
    validate,
    initialValue: process.env.CLI_COMMERCETOOLS_CLIENT_ID
  })).toString();
  const COMMERCETOOLS_CLIENT_SECRET = (await text({
    message: `Your ${project} Commercetools client secret:`,
    validate,
    initialValue: process.env.CLI_COMMERCETOOLS_CLIENT_SECRET
  })).toString();
  const COMMERCETOOLS_API_URL = (await text({
    message: `Your ${project} Commercetools API URL:`,
    validate,
    initialValue: process.env.CLI_COMMERCETOOLS_API_URL
  })).toString();
  const COMMERCETOOLS_AUTH_URL = (await text({
    message: `Your ${project} Commercetools AUTH URL:`,
    validate,
    initialValue: process.env.CLI_COMMERCETOOLS_AUTH_URL
  })).toString();
  return {
    COMMERCETOOLS_PROJECT_KEY,
    COMMERCETOOLS_CLIENT_ID,
    COMMERCETOOLS_CLIENT_SECRET,
    COMMERCETOOLS_API_URL,
    COMMERCETOOLS_AUTH_URL
  };
};
var getContentfulEnvs = async (project) => {
  if (!isDevMode) {
    return {
      CONTENTFUL_SPACE_ID: process.env.CLI_CONTENTFUL_SPACE_ID || "",
      CONTENTFUL_ENVIRONMENT: process.env.CLI_CONTENTFUL_CLASSIC_ENVIRONMENT || "",
      CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CLI_CONTENTFUL_CDA_ACCESS_TOKEN || "",
      CONTENTFUL_CPA_ACCESS_TOKEN: process.env.CLI_CONTENTFUL_CPA_ACCESS_TOKEN || ""
    };
  }
  const CONTENTFUL_SPACE_ID = (await text({
    message: `Your ${project} contentful space id:`,
    validate,
    initialValue: process.env.CLI_CONTENTFUL_SPACE_ID || ""
  })).toString();
  const CONTENTFUL_ENVIRONMENT = (await text({
    message: `Your ${project} contentful environment:`,
    validate,
    initialValue: process.env.CLI_CONTENTFUL_CLASSIC_ENVIRONMENT || ""
  })).toString();
  const CONTENTFUL_CDA_ACCESS_TOKEN = (await text({
    message: `Your ${project} contentful cda access token:`,
    validate,
    initialValue: process.env.CLI_CONTENTFUL_CDA_ACCESS_TOKEN || ""
  })).toString();
  const CONTENTFUL_CPA_ACCESS_TOKEN = (await text({
    message: `Your ${project} contentful cpa access token:`,
    validate,
    initialValue: process.env.CLI_CONTENTFUL_CPA_ACCESS_TOKEN || ""
  })).toString();
  return { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, CONTENTFUL_CDA_ACCESS_TOKEN, CONTENTFUL_CPA_ACCESS_TOKEN };
};
var getSegmentEnvs = async (project) => {
  if (!isDevMode) {
    return {
      NEXT_PUBLIC_ANALYTICS_WRITE_KEY: process.env.CLI_NEXT_PUBLIC_ANALYTICS_WRITE_KEY || "",
      SEGMENT_SPACE_ID: process.env.CLI_SEGMENT_SPACE_ID || "",
      SEGMENT_API_KEY: process.env.CLI_SEGMENT_API_KEY || ""
    };
  }
  const NEXT_PUBLIC_ANALYTICS_WRITE_KEY = (await text({
    message: `Your ${project} segment next public analytics write key:`,
    validate,
    initialValue: process.env.CLI_NEXT_PUBLIC_ANALYTICS_WRITE_KEY
  })).toString();
  const SEGMENT_SPACE_ID = (await text({
    message: `Your ${project} segment space id:`,
    validate,
    initialValue: process.env.CLI_SEGMENT_SPACE_ID
  })).toString();
  const SEGMENT_API_KEY = (await text({
    message: `Your ${project} segment api key:`,
    validate,
    initialValue: process.env.CLI_SEGMENT_API_KEY
  })).toString();
  return { NEXT_PUBLIC_ANALYTICS_WRITE_KEY, SEGMENT_SPACE_ID, SEGMENT_API_KEY };
};
var getGoogleAnalyticsEnvs = async (project) => {
  if (!isDevMode) {
    return {
      NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.CLI_GOOGLE_ANALYTICS_ID || ""
    };
  }
  const NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = (await text({
    message: `Your ${project} google analytics write key:`,
    validate,
    initialValue: process.env.CLI_GOOGLE_ANALYTICS_ID
  })).toString();
  return { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID };
};
var additionalModulesForComponentStarterKit = ({ integrationList, packagesList }) => async ({
  progressSpinner: progressSpinner2,
  project,
  variant = "baseline" /* Default */,
  projectPath
}) => {
  const pathToModules = path3.resolve(projectPath, "src", "modules");
  const pathToAdditionalCache = path3.resolve(projectPath, "content", "examples");
  if (!fs3.existsSync(pathToModules) || !fs3.existsSync(pathToAdditionalCache))
    return;
  const isRunAddingModules = await confirm({
    message: `Do you want to add additional Examples (Coveo Search)?`
  });
  if (!isRunAddingModules) {
    await remove(pathToModules);
    await remove(pathToAdditionalCache);
    return;
  }
  if (packagesList.length) {
    progressSpinner2.start(`Installing additional packages`);
    await installPackages(projectPath, packagesList);
    progressSpinner2.stop(`Finished installing additional packages`);
  }
  progressSpinner2.start(`Adding additional canvas cache`);
  await addExamplesCanvasCache(projectPath);
  progressSpinner2.stop(`Finished adding additional canvas cache`);
  progressSpinner2.start(`Adding additional integration`);
  demosRequiredIntegrationsMap[project][variant]?.push(...integrationList);
  progressSpinner2.stop(`Finished adding additional integration`);
  progressSpinner2.start(`Adding additional environment variables`);
  demosVariantsGetEnvsMap[project][variant] = getCoveoEnvs;
  progressSpinner2.stop(`Finished adding additional environment variables`);
  progressSpinner2.start(`Cleaning up module files`);
  const listOfCoveoFiles = await fs3.promises.readdir(path3.resolve(projectPath, "src", "modules", "coveo"));
  await Promise.all(
    listOfCoveoFiles.map(async (fileName) => {
      const pathToCoveoFile = path3.resolve(projectPath, "src", "modules", "coveo", fileName);
      const coveoFile = await fs3.promises.readFile(pathToCoveoFile, "utf-8");
      await fs3.promises.writeFile(
        pathToCoveoFile,
        coveoFile.replaceAll("/* eslint-disable @typescript-eslint/ban-ts-comment */", "").replaceAll(/\/\/ @ts-ignore:.+\n/g, "")
      );
    })
  );
  await fixEslint(projectPath);
  progressSpinner2.stop(`Finished cleaning up module files`);
  return;
};

// src/customIntegrations/commercetools.ts
var commercetoolsIntegration = {
  type: "commercetools-mesh-integration",
  displayName: "Commercetools",
  logoIconUrl: "https://canary-commercetools-mesh-integration.netlify.app/commercetools-logo.png",
  badgeIconUrl: "https://canary-commercetools-mesh-integration.netlify.app/commercetools-badge.svg",
  category: "unknown",
  baseLocationUrl: "https://canary-commercetools-mesh-integration.netlify.app",
  locations: {
    install: {
      description: [
        "Integrating Uniform with commercetools allows business users to have complete control over the presentation layer compositions assembled from the existing product content from commercetools without losing the freedom and flexibility of the Headless architecture.",
        "Uniform allows business users to personalize and A/B test product content coming from commercetools without a developer effort."
      ]
    },
    settings: {
      url: "/settings"
    },
    canvas: {
      parameterTypes: [
        {
          type: "commercetoolsProduct",
          displayName: "Commercetools Product",
          configureUrl: "/product-selector/config",
          editorUrl: "/product-selector/editor",
          renderableInPropertyPanel: false
        },
        {
          type: "commercetoolsProductList",
          displayName: "Commercetools Product List",
          configureUrl: "/product-selector/config",
          editorUrl: "/product-selector/editor",
          renderableInPropertyPanel: false
        },
        {
          type: "commercetoolsProductQuery",
          displayName: "Commercetools Product Query",
          configureUrl: "/product-query/config",
          editorUrl: "/product-query/editor",
          renderableInPropertyPanel: false
        },
        {
          type: "commercetoolsCategorySelector",
          displayName: "Commercetools Category",
          configureUrl: "/category-selector/config",
          editorUrl: "/category-selector/editor",
          editorLocations: {
            "category-editor-dialog": {
              url: "/category-editor-dialog"
            }
          },
          renderableInPropertyPanel: false
        }
      ]
    }
  }
};
var commercetools_default = commercetoolsIntegration;

// src/customIntegrations/openAI.ts
var openAIIntegration = {
  type: "openai",
  displayName: "OpenAI",
  logoIconUrl: "https://uniform-mesh-openai.vercel.app/openai.svg",
  badgeIconUrl: "https://uniform-mesh-openai.vercel.app/openai.svg",
  category: "unknown",
  baseLocationUrl: "https://uniform-mesh-openai.vercel.app",
  locations: {
    settings: {
      url: "/settings"
    },
    canvas: {
      parameterTypes: [
        {
          type: "ai-generated-text",
          displayName: "Text (AI generated)",
          configureUrl: "/text/configure",
          editorUrl: "/text/edit",
          editorLocations: {
            choices: {
              url: "../choices"
            }
          },
          renderableInPropertyPanel: true
        },
        {
          type: "ai-generated-template",
          displayName: "Template (AI generated)",
          configureUrl: "/template/configure",
          editorUrl: "/template/edit",
          editorLocations: {
            choices: {
              url: "../choices"
            }
          },
          renderableInPropertyPanel: true
        }
      ]
    }
  }
};
var openAI_default = openAIIntegration;

// src/mappers.ts
var demosVariantsGetEnvsMap = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: getContentfulEnvs
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: composeGetEnvFns(getAlgoliaEnvs, getSegmentEnvs, getGoogleAnalyticsEnvs)
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: composeGetEnvFns(getCoveoEnvs, getSegmentEnvs, getGoogleAnalyticsEnvs)
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: getCommercetoolsEnvs
  }
};
var Integrations = {
  Cloudinary: {
    name: "Cloudinary",
    data: {
      cloudName: process.env.CLI_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLI_CLOUDINARY_API_KEY,
      apiSecret: process.env.CLI_CLOUDINARY_API_SECRET
    }
  },
  Contentful: {
    name: "Contentful"
  },
  ContentfulClassic: {
    name: "Contentful Classic",
    link: "https://docs.uniform.app/docs/integrations/content/contentful/contentful-classic/uniform-in-contentful/uniformconf-nextjs-tutorial"
  },
  Contentstack: {
    name: `Contentstack`
  },
  ThemePackUniform: {
    name: `Theme Pack`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchDataFn: (data) => fetchThemePackThemes("uniform", data)
  },
  ThemePackJavadrip: {
    name: `Theme Pack`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchDataFn: (data) => fetchThemePackThemes("javadrip", data)
  },
  ThemePackJavadripBlack: {
    name: `Theme Pack`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchDataFn: (data) => fetchThemePackThemes("custom", data)
  },
  UniformFakeCommerce: {
    name: "Uniform Fake Commerce",
    data: {
      apiUrl: process.env.CLI_UNIFORM_FAKE_COMMERCE_API_URL || ""
    }
  },
  Algolia: {
    name: "Algolia",
    data: {
      applicationId: process.env.CLI_ALGOLIA_APPLICATION_ID,
      searchKey: process.env.CLI_ALGOLIA_SEARCH_KEY,
      indexName: process.env.CLI_ALGOLIA_INDEX_NAME
    }
  },
  Commercetools: {
    name: "Commercetools",
    customManifest: commercetools_default,
    data: {
      projectKey: process.env.CLI_COMMERCETOOLS_PROJECT_KEY,
      clientId: process.env.CLI_COMMERCETOOLS_CLIENT_ID,
      clientSecret: process.env.CLI_COMMERCETOOLS_CLIENT_SECRET,
      apiUrl: process.env.CLI_COMMERCETOOLS_API_URL,
      authUrl: process.env.CLI_COMMERCETOOLS_AUTH_URL
    }
  },
  Coveo: {
    name: "Coveo",
    data: {
      organizationId: process.env.CLI_COVEO_ORGANIZATION_ID,
      apiKey: process.env.CLI_COVEO_API_KEY
    }
  },
  OpenAI: {
    name: "OpenAI",
    customManifest: openAI_default
  }
};
var notMeshIntegrations = [Integrations.ContentfulClassic.name];
var BASE_URL = "http://localhost:3000/api/preview?secret=";
var demosPreviewUrlMap = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: `${BASE_URL}javadrip`
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: `${BASE_URL}javadrip`
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: `${BASE_URL}javadrip`
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: `${BASE_URL}javadrip`
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: `${BASE_URL}javadrip`
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: `${BASE_URL}hello-world`
  }
};
var demosRequiredIntegrationsMap = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: [Integrations.ThemePackJavadrip, Integrations.ContentfulClassic, Integrations.Cloudinary]
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: [Integrations.ThemePackJavadrip, Integrations.UniformFakeCommerce]
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: [
      Integrations.ThemePackJavadripBlack,
      Integrations.Algolia,
      Integrations.Cloudinary,
      Integrations.Contentful,
      Integrations.Contentstack,
      Integrations.OpenAI
    ]
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: [
      Integrations.ThemePackJavadripBlack,
      Integrations.Coveo,
      Integrations.Cloudinary,
      Integrations.Contentful,
      Integrations.OpenAI
    ]
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: [
      Integrations.ThemePackJavadripBlack,
      Integrations.Commercetools,
      Integrations.Contentful,
      Integrations.Contentstack,
      Integrations.Cloudinary
    ]
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: [Integrations.ThemePackUniform]
  }
};
var getContentStackBaseUrl = (contentStackRegion) => {
  if (contentStackRegion === "AZURE") {
    return "https://azure-na-api.contentstack.com/v3";
  } else if (contentStackRegion === "EU") {
    return "https://eu-api.contentstack.com/v3";
  } else {
    return "https://cdn.contentstack.io/v3";
  }
};
var DataSource = {
  Contentful: {
    integrationDisplayName: "Contentful",
    dataSourceId: "contentfulDataSource",
    dataSourceDisplayName: "Contentful Data Source",
    connectorType: "contentful-data-connection",
    baseUrl: `https://cdn.contentful.com/spaces/${process.env.CLI_CONTENTFUL_SPACE_ID}/environments/${process.env.CLI_CONTENTFUL_ENVIRONMENT}`,
    dataProperties: {
      headers: [{ key: "Content-Type", value: "application/json" }],
      parameters: [
        {
          key: "access_token",
          value: process.env.CLI_CONTENTFUL_CDA_ACCESS_TOKEN
        }
      ],
      custom: {
        spaceId: process.env.CLI_CONTENTFUL_SPACE_ID,
        environmentId: process.env.CLI_CONTENTFUL_ENVIRONMENT
      }
    }
  },
  Contentstack: {
    integrationDisplayName: "Contentstack",
    dataSourceDisplayName: "Contentstack Data Source",
    dataSourceId: "contentstackDataSource",
    connectorType: "contentstack-data-connection",
    baseUrl: getContentStackBaseUrl(process.env.CLI_CONTENT_STACK_REGION || ""),
    dataProperties: {
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "api_key", value: process.env.CLI_CONTENT_STACK_API_KEY },
        { key: "access_token", value: process.env.CLI_CONTENT_STACK_DELIVERY_TOKEN }
      ]
    }
  },
  Algolia: {
    integrationDisplayName: "Algolia",
    dataSourceDisplayName: "Algolia Data Source",
    dataSourceId: "algoliaDataSource",
    connectorType: "algolia-data-connection",
    baseUrl: `https://${process.env.CLI_ALGOLIA_APPLICATION_ID}-dsn.algolia.net/1/indexes`,
    dataProperties: {
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "X-Algolia-Application-Id", value: process.env.CLI_ALGOLIA_APPLICATION_ID },
        { key: "X-Algolia-API-Key", value: process.env.CLI_ALGOLIA_SEARCH_KEY }
      ]
    }
  },
  Coveo: {
    integrationDisplayName: "Coveo",
    dataSourceDisplayName: "Coveo Data Source",
    dataSourceId: "coveoDataSource",
    connectorType: "coveo-data-connection",
    baseUrl: `https://${process.env.CLI_COVEO_ORGANIZATION_ID}.org.coveo.com/rest/search/v2`,
    dataProperties: {
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "Authorization", value: `Bearer ${process.env.CLI_COVEO_API_KEY}` }
      ]
    }
  },
  UniformFakeCommerce: {
    integrationDisplayName: "Uniform Fake Commerce",
    dataSourceDisplayName: "Fake Commerce Data Source",
    dataSourceId: "fakeCommerceDataSource",
    connectorType: "fake-commerce-data-connection",
    baseUrl: process.env.CLI_UNIFORM_FAKE_COMMERCE_NGM_API_URL || "",
    dataProperties: {}
  }
};
var demosRequiredDataSourceMap = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: []
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: [DataSource.UniformFakeCommerce]
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: [DataSource.Contentful, DataSource.Contentstack, DataSource.Algolia]
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: [DataSource.Contentful, DataSource.Coveo]
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: [DataSource.Contentful, DataSource.Contentstack]
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: []
  }
};
var demosVariantsRequiredLocales = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: ["en-US", "de-DE", "es-ES"]
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: []
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: []
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: []
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: []
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: []
  }
};
var demosVariantsModulesRequire = {
  ["localization" /* Localization */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["commerce-starter" /* CommerceStarter */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["component-starter-kit" /* ComponentStarterKit */]: {
    ["baseline" /* Default */]: additionalModulesForComponentStarterKit({
      integrationList: [Integrations.Coveo],
      packagesList: ["@coveo/headless@2.31.0"]
    })
  },
  ["commerce-algolia" /* CommerceAlgoliaDemo */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["commerce-coveo" /* CommerceCoveoDemo */]: {
    ["baseline" /* Default */]: () => void 0
  },
  ["commerce-commercetools" /* CommerceCommercetoolsDemo */]: {
    ["baseline" /* Default */]: () => void 0
  }
};

// src/commands/setupUniform/index.ts
import jwt from "jsonwebtoken";
import fetch4 from "node-fetch";

// src/commands/setupUniform/gql.ts
import fetch2 from "node-fetch";
var getAvailableTeams = async (params) => {
  const { apiHost = "https://uniform.app", headers, subject } = params;
  const query = `
  query GetUserInfo($subject: String!) {
    info: identities_by_pk(subject: $subject) {
      name
      email_address
      teams: organizations_identities(order_by: { organization: { name: asc } }) {
        team: organization {
          name
          id
          sites {
            name
            id
          }
        }
      }
    }
  }
  `;
  const endpoint = new URL("/v1/graphql", apiHost);
  const response = await fetch2(endpoint, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables: {
        subject
      }
    }),
    headers
  }).then((res) => res.json());
  return response.data.info.teams;
};

// src/commands/setupUniform/api.ts
import fetch3 from "node-fetch";

// src/uniform/index.ts
var WRITE_PERMISSIONS = [
  "PROJECT",
  "UPM_SCHEMA",
  "UPM_READ",
  "UPM_PUB",
  "UPM_CREATE",
  "UPM_WRITE",
  "UPM_DELETE",
  "UPM_PUBLISH",
  "OPT_READ",
  "OPT_CREATE_ENRICHMENTS",
  "OPT_WRITE_ENRICHMENTS",
  "OPT_DELETE_ENRICHMENTS",
  "OPT_CREATE_INTENTS",
  "OPT_WRITE_INTENTS",
  "OPT_DELETE_INTENTS",
  "OPT_PUB",
  "OPT_PUBLISH",
  "OPT_CREATE_QUIRKS",
  "OPT_WRITE_QUIRKS",
  "OPT_DELETE_QUIRKS",
  "OPT_CREATE_SIGNALS",
  "OPT_WRITE_SIGNALS",
  "OPT_DELETE_SIGNALS",
  "OPT_CREATE_TESTS",
  "OPT_WRITE_TESTS",
  "OPT_DELETE_TESTS",
  "RDT_UPDATE",
  "RDT_CREATE",
  "RDT_DELETE",
  "UPM_DATACONN",
  "UPM_DATATYPE",
  "PRM_SCHEMA"
];
var makeApiKey = (teamId, projectId, name, permissions) => ({
  name,
  teamId,
  projects: [
    {
      projectId,
      permissions,
      roles: [],
      useCustom: true
    }
  ],
  email: "",
  identity_subject: "",
  isAdmin: false
});
var makeWriteApiKey = (teamId, projectId) => makeApiKey(teamId, projectId, "Created by Demos CLI (write)", WRITE_PERMISSIONS);

// src/commands/setupUniform/api.ts
var createUniformProject = async (params) => {
  const { apiHost, teamId, headers, projectName, previewUrl, projectTypeId } = params;
  const url = new URL("/api/v1/project", apiHost);
  const body = {
    name: projectName,
    projectTypeId,
    teamId,
    previewUrl
  };
  const response = await fetch3(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  const installResponse = await response.json();
  if (response.status !== 200) {
    const errorMessage = installResponse?.errorMessage;
    throw new Error(`Unable to create project: ${errorMessage}`);
  }
  return {
    id: installResponse?.id
  };
};
var getIntegrationDefinitionByDisplayName = async (params) => {
  const { displayName, teamId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/integration-definitions", apiHost);
  url.searchParams.append("teamId", teamId);
  url.searchParams.append("includePublic", "false");
  url.searchParams.append("teamSpecificType", "true");
  const availableIntegrationsResult = await fetch3(url, {
    headers
  }).then((res) => res.json());
  const availableIntegrations = availableIntegrationsResult?.results;
  if (!Array.isArray(availableIntegrations))
    return;
  return availableIntegrations.find((integration) => integration.displayName === displayName);
};
var defineIntegration = async (params) => {
  const { data, teamId, apiHost = "https://uniform.app", headers } = params;
  const body = {
    teamId,
    data
  };
  const url = new URL("/api/v1/integration-definitions", apiHost);
  const response = await fetch3(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  const result = response;
  if (result?.displayName === data.displayName) {
    return result;
  }
};
var getInstalledIntegration = async (params) => {
  const { projectId, type, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/integration-installations", apiHost);
  url.searchParams.append("projectId", projectId);
  url.searchParams.append("type", type);
  url.searchParams.append("exactType", "true");
  url.searchParams.append("teamSpecificType", "true");
  const installedIntegrationResult = await fetch3(url, {
    headers
  }).then((res) => res.json());
  const installedIntegrations = installedIntegrationResult?.results;
  if (Array.isArray(installedIntegrations) && installedIntegrations.length === 1)
    return installedIntegrations[0];
};
var installIntegration = async (params) => {
  const { data, projectId, type, apiHost = "https://uniform.app", headers } = params;
  const body = {
    projectId,
    exactType: true,
    type,
    data
  };
  const url = new URL("/api/v1/integration-installations", apiHost);
  const response = await fetch3(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  if (response.status !== 204) {
    const installResponse = await response.json();
    const errorMessage = installResponse?.errorMessage;
    throw new Error(`Unable to install integration: ${errorMessage}`);
  }
  return getInstalledIntegration({ projectId, type, headers, apiHost });
};
var getDataSource = async (params) => {
  const { projectId, dataSourceId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/data-source", apiHost);
  url.searchParams.append("projectId", projectId);
  url.searchParams.append("dataSourceId", dataSourceId);
  const response = await fetch3(url, {
    headers
  }).then((res) => res.json());
  return response?.result;
};
var addDataSource = async (params) => {
  const {
    teamId,
    projectId,
    integrationDisplayName,
    connectorType,
    baseUrl,
    dataSourceDisplayName,
    dataSourceId,
    dataProperties,
    apiHost = "https://uniform.app",
    headers
  } = params;
  const integrationDefinition = await getIntegrationDefinitionByDisplayName({
    displayName: integrationDisplayName,
    teamId,
    apiHost,
    headers
  });
  if (!integrationDefinition) {
    throw new Error(`Unable to find the integration definition: ${integrationDisplayName}.`);
  }
  const body = {
    projectId,
    integrationType: integrationDefinition.type,
    data: {
      id: dataSourceId,
      displayName: dataSourceDisplayName,
      connectorType,
      baseUrl,
      ...dataProperties
    }
  };
  const url = new URL("/api/v1/data-source", apiHost);
  const response = await fetch3(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body)
  });
  if (response.status !== 204) {
    const addResponse = await response.json();
    const errorMessage = addResponse?.errorMessage;
    throw new Error(`Unable to add ${integrationDisplayName} data source: ${errorMessage}`);
  }
  return getDataSource({ projectId, dataSourceId, apiHost, headers });
};
var createApiKeys = async (params) => {
  const { teamId, projectId, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/members", apiHost);
  const writeApiKeyResponse = await fetch3(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(makeWriteApiKey(teamId, projectId))
  }).then((res) => res.json());
  return {
    writeApiKey: writeApiKeyResponse.apiKey
  };
};
var createUniformTeam = async (params) => {
  const { name, apiHost = "https://uniform.app", headers } = params;
  const url = new URL("/api/v1/team", apiHost);
  const response = await fetch3(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ name })
  }).then((res) => res.json());
  return {
    id: response?.id
  };
};

// src/commands/setupUniform/utils.ts
var configureIntegration = async ({
  displayName,
  teamId,
  projectId,
  integrationParams,
  fetchIntegrationParamsFn,
  customManifest,
  apiHost,
  headers
}) => {
  if (customManifest) {
    await defineIntegration({
      data: customManifest,
      teamId,
      apiHost,
      headers
    });
  }
  const integration = await getIntegrationDefinitionByDisplayName({
    displayName,
    teamId,
    apiHost,
    headers
  });
  if (!integration) {
    throw new Error(`Integration definition is not available: ${displayName}`);
  }
  const installedIntegration = await getInstalledIntegration({
    projectId,
    type: integration.type,
    apiHost,
    headers
  });
  if (installedIntegration) {
    return;
  }
  const dynamicIntegrationParams = await fetchIntegrationParamsFn?.({ apiHost });
  const newInstalledIntegration = await installIntegration({
    projectId,
    type: integration.type,
    data: dynamicIntegrationParams || integrationParams,
    apiHost,
    headers
  });
  if (!newInstalledIntegration) {
    return;
  }
};
var configureDataSource = async ({
  teamId,
  projectId,
  integrationDisplayName,
  headers,
  connectorType,
  baseUrl,
  dataSourceDisplayName,
  dataSourceId,
  dataProperties,
  apiHost
}) => {
  const dataSource = await getDataSource({
    projectId,
    dataSourceId,
    headers,
    apiHost
  });
  if (dataSource) {
    return;
  }
  await addDataSource({
    teamId,
    projectId,
    integrationDisplayName,
    headers,
    connectorType,
    baseUrl,
    dataSourceDisplayName,
    dataSourceId,
    dataProperties,
    apiHost
  });
};

// src/commands/setupUniform/index.ts
var getAvailableProjectTypes = async (params) => {
  const { uniformAccessToken, uniformApiHost, teamId } = params;
  const headers = {
    accept: "application/json",
    authorization: `Bearer ${uniformAccessToken}`
  };
  const url = new URL("/api/v1/limits", uniformApiHost);
  url.searchParams.append("teamId", teamId);
  const response = await fetch4(url, {
    method: "POST",
    headers
  });
  const json = await response.json();
  const projectTypes = json?.limits?.projects;
  return { projectTypes };
};
var setupUniformProject = async (params, progressSpinner2) => {
  const { uniformApiHost, uniformAccessToken, project, variant } = params;
  const headers = {
    accept: "application/json",
    authorization: `Bearer ${uniformAccessToken}`
  };
  const decoded = jwt.decode(uniformAccessToken, { complete: false });
  const teams = await getAvailableTeams({ apiHost: uniformApiHost, headers, subject: decoded?.sub?.toString() });
  const availableTeams = teams.map(({ team: team2 }) => ({ value: team2.id, label: team2.name }));
  let teamId = await getUniformTeam([...availableTeams, { value: "new", label: "\u2795 Create new" }]);
  if (teamId === "new") {
    const teamName = await getUniformTeamName();
    const createTeamResponse = await createUniformTeam({ apiHost: uniformApiHost, name: teamName, headers });
    teamId = createTeamResponse.id;
  }
  const team = teams.find(({ team: team2 }) => team2.id === teamId)?.team;
  const availableProjects = (team?.sites || []).map((site) => ({ value: site.id, label: site.name }));
  let projectId = await getUniformProject([...availableProjects, { value: "new", label: "\u2795 Create new" }]);
  if (projectId === "new") {
    const { projectTypes } = await getAvailableProjectTypes({ uniformApiHost, uniformAccessToken, teamId });
    if (projectTypes.length === 0) {
      console.log("Your Uniform team is not licensed for any additional projects.");
      return {};
    }
    const projectTypeId = await getUniformProjectTypeId(projectTypes);
    const projectName = await getUniformProjectName();
    progressSpinner2.start("Start creating uniform project");
    const previewUrl = demosPreviewUrlMap[project]?.[variant];
    const createdProject = await createUniformProject({
      teamId,
      apiHost: uniformApiHost,
      projectName,
      headers,
      previewUrl,
      projectTypeId
    });
    projectId = createdProject.id;
    progressSpinner2.stop(`Finished creating uniform project. Id: ${projectId}. Preview url set to ${previewUrl}`);
  }
  progressSpinner2.start("Start creating uniform api keys");
  const createdKeys = await createApiKeys({ teamId, projectId, apiHost: uniformApiHost, headers });
  const { writeApiKey } = createdKeys;
  progressSpinner2.stop("Api keys created");
  const integrationsToInstall = demosRequiredIntegrationsMap[project]?.[variant] || [];
  const onlyMeshIntegrations = integrationsToInstall.filter((integration) => !integration.link);
  for (const integration of onlyMeshIntegrations) {
    progressSpinner2.start(
      `Start installing ${integration.name} integration.${integration.customManifest ? " Custom manifest will be used." : ""}`
    );
    await configureIntegration({
      displayName: integration.name,
      teamId,
      projectId,
      integrationParams: integration.data,
      fetchIntegrationParamsFn: integration.fetchDataFn,
      customManifest: integration.customManifest,
      apiHost: uniformApiHost,
      headers
    });
    progressSpinner2.stop(`Finished installing ${integration.name} integration`);
  }
  const dataSourceToInstall = demosRequiredDataSourceMap[project]?.[variant] || [];
  for (const dataSource of dataSourceToInstall) {
    progressSpinner2.start(`Start installing ${dataSource.dataSourceDisplayName} data source`);
    await configureDataSource({
      teamId,
      projectId,
      integrationDisplayName: dataSource.integrationDisplayName,
      connectorType: dataSource.connectorType,
      baseUrl: dataSource.baseUrl,
      dataSourceDisplayName: dataSource.dataSourceDisplayName,
      dataSourceId: dataSource.dataSourceId,
      dataProperties: dataSource.dataProperties,
      apiHost: uniformApiHost,
      headers
    });
    progressSpinner2.stop(`Finished installing ${dataSource.dataSourceDisplayName} data source`);
  }
  return {
    uniformTeamId: teamId,
    uniformProjectId: projectId,
    uniformApiKey: writeApiKey,
    uniformHeaders: headers
  };
};

// src/index.ts
var progressSpinner = spinner();
var IS_MANUAL_CREATING = false;
var processEnvFile = async (uniformCredentials, project, projectPath, variant = "baseline" /* Default */) => {
  progressSpinner.start("Checking your env file");
  progressSpinner.stop("Your env file is not correct");
  const projectVariantsGetEnvsMap = demosVariantsGetEnvsMap[project];
  const getAdditionalEnvDataFn = projectVariantsGetEnvsMap?.[variant];
  const additionalEnvData = await getAdditionalEnvDataFn?.(project, variant);
  progressSpinner.start("Creating env file");
  const { uniformApiKey, uniformProjectId, uniformCliBaseUrl, uniformEdgeApiHost } = uniformCredentials;
  await fillEnvFiles(
    projectPath,
    uniformApiKey,
    uniformProjectId,
    uniformCliBaseUrl,
    uniformEdgeApiHost,
    additionalEnvData
  );
  progressSpinner.stop("Env file created");
};
var runResetCanvasJourney = async (project, alreadyDefinedProjectPath) => {
  let projectPath = alreadyDefinedProjectPath;
  if (!projectPath) {
    projectPath = await getProjectLocation(path4.resolve("."));
    projectPath = getExistDemoPath(projectPath, project);
  }
  if (!isProjectExist(projectPath)) {
    cancel(`${project} does not exist in ${projectPath}, please run script again and export your demo first`);
    return process.exit(0);
  }
  progressSpinner.start("Pushing canvas configuration");
  await runPush(projectPath);
  progressSpinner.stop("Canvas configuration pushed");
};
var runRunDemoJourney = async (project, variant = "baseline" /* Default */) => {
  const projectPath = path4.resolve("../");
  if (!isProjectExist(projectPath)) {
    cancel(`${project} does not exist in ${projectPath}, please run script again and export your demo first`);
    return process.exit(0);
  }
  const requiredLocales = demosVariantsRequiredLocales[project]?.[variant];
  let hasManualStepsTodo = false;
  if (requiredLocales?.length) {
    hasManualStepsTodo = true;
    note(
      `\u{1F6A7} \u{1F6A7} \u{1F6A7} This demo requires the following locales: 
${requiredLocales.join(
        ", "
      )}.
Please add them on the Settings -> Canvas Settings page of your project.

Please make sure that your Contentful account has the administrator role in order to get locales.`,
      "Locales required"
    );
  }
  const requiredIntegrations = demosRequiredIntegrationsMap[project]?.[variant];
  const notMeshIntegration = requiredIntegrations?.filter((integration) => notMeshIntegrations.includes(integration.name)) || [];
  if (notMeshIntegration?.length) {
    hasManualStepsTodo = true;
    const buildedIntegrationListString = notMeshIntegration.map(
      (integration) => `  * ${integration.name}${integration.link ? ` - ${integration.link}` : ""}`
    );
    note(
      `\u{1F6A7} \u{1F6A7} \u{1F6A7} This demo requires 
${buildedIntegrationListString.join("\n")}
${notMeshIntegrations.length > 1 ? "integrations" : "integration"} to be installed.`,
      "Integration required"
    );
  }
  progressSpinner.start("Checking your dependencies");
  if (isNodeModulesExist(projectPath)) {
    progressSpinner.stop("Dependencies found");
  } else {
    progressSpinner.stop("Dependencies not found");
    progressSpinner.start("Installing dependencies");
    await installDependencies(projectPath);
    progressSpinner.stop("Dependencies installed");
  }
  if (IS_MANUAL_CREATING) {
    const { uniformApiKey, uniformCliBaseUrl, uniformEdgeApiHost, uniformProjectId } = await getUniformEnvs(project);
    await processEnvFile(
      { uniformApiKey, uniformCliBaseUrl, uniformEdgeApiHost, uniformProjectId },
      project,
      projectPath,
      variant
    );
  } else {
    const uniformCredentials = await getUniformAccessTokenEnvs();
    if (!uniformCredentials)
      return;
    const { uniformProjectId, uniformApiKey } = await setupUniformProject(
      {
        uniformApiHost: uniformCredentials.uniformCliBaseUrl,
        uniformAccessToken: uniformCredentials.uniformAccessToken,
        project,
        variant
      },
      progressSpinner
    );
    if (!uniformProjectId || !uniformApiKey) {
      return;
    }
    await processEnvFile({ ...uniformCredentials, uniformProjectId, uniformApiKey }, project, projectPath, variant);
  }
  const shouldRunPush = await confirm({
    message: `Do you want to push canvas configuration?${hasManualStepsTodo ? "\n\u{1F6A7} \u{1F6A7} \u{1F6A7} Please make sure you have applied all manual steps which were described above." : ""}`
  });
  if (shouldRunPush)
    await runResetCanvasJourney(project, projectPath);
  progressSpinner.start("Running your demo");
  await buildDemo(projectPath);
  progressSpinner.stop("Demo running check localhost:3000");
  runDemo(projectPath);
};
var preSetDemo = async (project, variant = "baseline" /* Default */) => {
  const projectPath = path4.resolve("../");
  const renderingModeOptions = [];
  const isSSRModeAvailable = await scanPageDirectory(projectPath, "ssr" /* SSR */);
  const isSSGModeAvailable = await scanPageDirectory(projectPath, "ssg" /* SSG */);
  if (isSSRModeAvailable) {
    renderingModeOptions.push({ value: "ssr", label: "Server-side Rendering 	(SSR)" });
  }
  if (isSSGModeAvailable) {
    renderingModeOptions.push({ value: "ssg", label: "Static Site Generation 	(SSG)" });
  }
  const appMode = renderingModeOptions.length ? (await select({
    message: "Which rendering mode do you prefer?",
    options: renderingModeOptions,
    initialValue: "ssr" /* SSR */
  })).toString() : void 0;
  if (appMode) {
    await switchModeInPageDirectory(projectPath, appMode, ["revalidate.ts"]);
  }
  const projectVariantsModulesRequire = demosVariantsModulesRequire[project];
  const installModules = projectVariantsModulesRequire?.[variant];
  await installModules?.({
    progressSpinner,
    project,
    variant,
    projectPath
  });
  if (!Boolean(installModules)) {
    progressSpinner.start(`Cleaning up`);
    await fixEslint(projectPath);
    progressSpinner.stop(`Finished cleaning up`);
  }
};
(async () => {
  clear();
  if (!isMetaDataExist()) {
    note(color2.red("Looks like you metadata.json file is not configured. Please check it and try again."));
    return process.exit(0);
  }
  try {
    const { project, variant } = await parseMetadata();
    showDemoHeader(project, variant);
    await preSetDemo(project, variant);
    await runRunDemoJourney(project, variant);
  } catch (e) {
    console.error(e);
    return process.exit(0);
  }
})();
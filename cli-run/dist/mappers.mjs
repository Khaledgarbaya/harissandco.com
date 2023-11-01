// src/informationCollector.ts
import fs3 from "fs";
import path3 from "path";
import color from "picocolors";
import open from "open";

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
var remove = (path4) => fs.promises.rm(path4, { recursive: true, force: true });
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

// src/commands/run.ts
import fs2 from "fs";
import path2 from "path";
import os from "os";
import { execSync } from "child_process";
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
  progressSpinner,
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
    progressSpinner.start(`Installing additional packages`);
    await installPackages(projectPath, packagesList);
    progressSpinner.stop(`Finished installing additional packages`);
  }
  progressSpinner.start(`Adding additional canvas cache`);
  await addExamplesCanvasCache(projectPath);
  progressSpinner.stop(`Finished adding additional canvas cache`);
  progressSpinner.start(`Adding additional integration`);
  demosRequiredIntegrationsMap[project][variant]?.push(...integrationList);
  progressSpinner.stop(`Finished adding additional integration`);
  progressSpinner.start(`Adding additional environment variables`);
  demosVariantsGetEnvsMap[project][variant] = getCoveoEnvs;
  progressSpinner.stop(`Finished adding additional environment variables`);
  progressSpinner.start(`Cleaning up module files`);
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
  progressSpinner.stop(`Finished cleaning up module files`);
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
export {
  Integrations,
  demosPreviewUrlMap,
  demosRequiredDataSourceMap,
  demosRequiredIntegrationsMap,
  demosVariantsGetEnvsMap,
  demosVariantsModulesRequire,
  demosVariantsRequiredLocales,
  notMeshIntegrations
};

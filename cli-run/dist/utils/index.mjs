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
var remove = (path2) => fs.promises.rm(path2, { recursive: true, force: true });
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
export {
  addExamplesCanvasCache,
  composeGetEnvFns,
  execPromise,
  fetchThemePackThemes,
  remove,
  scanPageDirectory,
  switchModeInPageDirectory
};

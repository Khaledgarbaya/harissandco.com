// src/commands/run.ts
import fs2 from "fs";
import path2 from "path";
import os from "os";

// src/utils/index.ts
import childProcess from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
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

// src/commands/run.ts
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
export {
  buildDemo,
  fillEnvFiles,
  fixEslint,
  getExistDemoPath,
  installDependencies,
  installPackages,
  isMetaDataExist,
  isNodeModulesExist,
  isProjectExist,
  parseEnvFile,
  parseMetadata,
  runDemo,
  runPush
};

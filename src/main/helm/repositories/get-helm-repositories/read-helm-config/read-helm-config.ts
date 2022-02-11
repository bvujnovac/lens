/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import yaml from "js-yaml";

export interface HelmRepoConfig {
  repositories: HelmRepo[]
}

export interface HelmRepo {
  name: string;
  url: string;
  cacheFilePath?: string
  caFile?: string,
  certFile?: string,
  insecureSkipTlsVerify?: boolean,
  keyFile?: string,
  username?: string,
  password?: string,
}

interface Dependencies {
  readFile: (path: string, encoding: string) => Promise<string>;
}

export const readHelmConfig = ({ readFile }: Dependencies) => async (configPath: string): Promise<HelmRepoConfig> => {
  const emptyConfiguration: HelmRepoConfig = {
    repositories: [],
  };

  let rawConfig: string;

  try {
    rawConfig = await readFile(configPath, "utf8");
  } catch(readFileError) {
    return emptyConfiguration;
  }

  let parsedConfig: any;

  try {
    parsedConfig = yaml.load(rawConfig);
  } catch(error) {
    return emptyConfiguration;
  }

  const resultIsConfig = !!(typeof parsedConfig === "object" && parsedConfig);

  if (!resultIsConfig) {
    return emptyConfiguration;
  }

  return parsedConfig as HelmRepoConfig;
};
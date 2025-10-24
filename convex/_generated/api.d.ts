/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as componentPreviews from "../componentPreviews.js";
import type * as components_ from "../components.js";
import type * as files from "../files.js";
import type * as gistConfigurations from "../gistConfigurations.js";
import type * as migrations from "../migrations.js";
import type * as previewConfigurations from "../previewConfigurations.js";
import type * as userProfiles from "../userProfiles.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  componentPreviews: typeof componentPreviews;
  components: typeof components_;
  files: typeof files;
  gistConfigurations: typeof gistConfigurations;
  migrations: typeof migrations;
  previewConfigurations: typeof previewConfigurations;
  userProfiles: typeof userProfiles;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};

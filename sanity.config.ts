import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./sanity/schemas/index";
import { webhooksTrigger } from "sanity-plugin-webhooks-trigger";

export default defineConfig({
  name: "default",
  title: "Animanoir.xyz Blog",

  projectId: "ztpln7un",
  dataset: "production",

  plugins: [structureTool(), visionTool(), codeInput(), webhooksTrigger()],

  schema: {
    types: schemaTypes,
  },
});


import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./sanity/schemas/index";

export default defineConfig({
  name: "default",
  title: "Animanoir.xyz Blog",

  projectId: "ztpln7un",
  dataset: "production",

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});


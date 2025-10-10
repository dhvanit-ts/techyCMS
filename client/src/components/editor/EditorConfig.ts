import {
  customThemeConfig,
  defaultAssets,
  deviceConfig,
  globalStylesConfig,
  layoutConfig,
  pluginsConfig,
} from "@/components/editor/StudioUtils";

export const editorOptions = {
  theme: "dark",
  fonts: { enableFontManager: true },
  layout: layoutConfig,
  globalStyles: globalStylesConfig,
  devices: deviceConfig,
  plugins: pluginsConfig,
  project: {
    default: {
      assets: defaultAssets,
      pages: [{ name: "Home", component: "<h1>Hello Studio SDK 👋</h1>" }],
    },
  },
};

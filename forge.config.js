const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Textonom',
    executableName: 'textonom',
    appBundleId: 'com.netroforge.textonom',
    appCategoryType: 'public.app-category.developer-tools',
    icon: './public/textonom-icon.png',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Textonom',
        authors: 'Netroforge',
        description: 'A text editor that performs popular routine transformations of text on your local machine',
        iconUrl: 'https://raw.githubusercontent.com/yourusername/textonom/main/public/textonom-icon.png',
        setupIcon: './public/textonom-icon.png'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux', 'darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Netroforge',
          homepage: 'https://github.com/yourusername/textonom',
          icon: './public/textonom-icon.png',
          categories: ['Utility', 'TextEditor', 'Development']
        }
      },
    },

  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@our-trips/eslint-config-custom`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};

module.exports = {
  expo: {
    name: "expense-tracker",
    slug: "expense-tracker",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lethiendinh.expensetracker",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF"
      },
      package: "com.lethiendinh.expensetracker"
    },
    plugins: [
      "expo-sqlite"
    ],
    extra: {
      eas: {
        projectId: "886f47db-e293-4885-a571-9888299242c8"
      }
    }
  }
};

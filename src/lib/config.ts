export const appConfig = {
  appName: "INFS 1101 Python Trainer",
  storagePrefix: "infs1101_",
  schemaVersion: 1,
  contentVersion: "2026.06.16",
  xpPerActivity: 10,
  passThreshold: 70,
  lockLessons: false,
  pyodideTimeoutMs: 4500,
  pyodideLoadTimeoutMs: 60000,
  caseSensitiveAnswers: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  teacherMode: process.env.NEXT_PUBLIC_TEACHER_MODE === "on"
};

export function withBasePath(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${appConfig.basePath}${cleanPath}`;
}

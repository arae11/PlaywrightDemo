type DataProfile = "comprehensive" | "bau" | "smoke";

const profiles: Record<DataProfile, { excelFileName: string; defaultSheet: string }> = {
  comprehensive: {
    excelFileName: "Railcard_Purchase_Comprehensive.xlsx",
    defaultSheet: "16-25_BFS",
  },
    bau: {
    excelFileName: "Railcard_Purchase_BAU.xlsx",
    defaultSheet: "16-25_BFS",
  },
  smoke: {
    excelFileName: "Railcard_Purchase_Smoke.xlsx",
    defaultSheet: "16-25_BFS",
  },
};

const activeProfile = (process.env.TEST_PROFILE as DataProfile) || "bau";

export const testConfig = profiles[activeProfile];

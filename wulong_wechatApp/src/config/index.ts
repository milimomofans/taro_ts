const MOCK_BASE_URL = "https://yapi.tuidanke.com"
export const API_DEFAULT_CONFIG = {
  // mockBaseURL: 'http://mch.qqmylife.com/v1/mch',
  mockBaseURL: MOCK_BASE_URL,
  mock: false,
  debug: false,
  sep: "/",
};

export const MNP_REQUEST_DEFAULT_CONFIG = {
  timeout: 20000,
  maxContentLength: 2000,
  baseURL: "http://qmff.tuidanke.com/rest/",
  headers: {},
  redirectLoginPage: "/pages/me/me",
};

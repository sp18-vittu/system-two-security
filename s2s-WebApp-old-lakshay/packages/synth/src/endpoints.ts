const endpoints = {
  SIGIN: "/login",
  SIGNUP: "/register",
  PASSWORDRESET: "/password-reset",
  MESSAGES: "/messages",
  PROMT: "/prompting",
  CONNECTORS: "/connector/integrations",
  CONNECTOR_MODULES: "/connector/salesforce/modules",
  CREATE_CONNECTOR: "/connector/salesforce/auth",
  EXECUTE_CONNECTOR: "/connector/salesforce/flow/start",
  IMPORT_CONNECTOR_MODULE: "/connector/salesforce/flow/create",
  LOAD_DOCUMENTS: "/connector/salesforce/modules",
};

export default endpoints;

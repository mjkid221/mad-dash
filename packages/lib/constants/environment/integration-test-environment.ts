/**
 * This is a hardcoded object that will be returned when the application is in integration test mode.
 * This is to prevent runnings test against a real deployed environment.
 */
export const integrationTestEnvironment: Record<string, string> = {
  /**
   * mongo-db-memory-server will generate its own URI for the in-memory database so this is not needed
   */
  MONGODB_URI: "test-mongo-db-uri",
  INTEGRATION_TEST_MODE: "true",
};

import { describe, expect, test, vi } from "vitest";
import { Logger } from "./logger";

const createMockConsole = () => ({
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
});

describe("Logger", function () {
  const testNamespace = "test-namespace";

  test("creates instance", () => {
    const logger = new Logger(testNamespace);

    expect(logger).toBeInstanceOf(Logger);
  });

  test("logs messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const logger = new Logger(testNamespace, { console: mockConsole });

    logger.log("test message");

    const message = mockConsole.log.mock.calls[0][0];

    expect(message).toContain(" test-namespace ");
    expect(message).toContain(" test message");
  });

  test("warns messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const warnger = new Logger(testNamespace, { console: mockConsole });

    warnger.warn("test message");

    const message = mockConsole.warn.mock.calls[0][0];

    expect(message).toContain(" test-namespace ");
    expect(message).toContain(" test message");
  });

  test("errors messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const errorger = new Logger(testNamespace, { console: mockConsole });

    errorger.error("test message");
    const message = mockConsole.error.mock.calls[0][0];

    expect(message).toContain(" test-namespace ");
    expect(message).toContain(" test message");
  });

  test("debugs messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const debugLogger = new Logger(testNamespace, { console: mockConsole });

    debugLogger.debug("test message");

    const message = mockConsole.log.mock.calls[0][0];

    expect(message).toContain(" test-namespace ");
    expect(message).toContain(" test message");
  });

  test("returns throwable errors", () => {
    const mockConsole = createMockConsole();

    const debugLogger = new Logger(testNamespace, { console: mockConsole });

    const error = debugLogger.thrown("test message");

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("test message");
  });

  test("returns throwable child errors", () => {
    const mockConsole = createMockConsole();

    const debugLogger = new Logger(testNamespace, { console: mockConsole });

    class TestError extends Error {
      name = "TestError";
    }

    const error = debugLogger.thrown(new TestError("test message"));

    expect(error).toBeInstanceOf(TestError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("test message");
  });
});

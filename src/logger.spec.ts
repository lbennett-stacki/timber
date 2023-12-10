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

    const logger = new Logger(testNamespace, {}, {}, mockConsole);

    logger.log("test message");

    expect(mockConsole.log.mock.calls[0][0]).toContain(
        ' test-namespace ',
    );
    expect(mockConsole.log.mock.calls[0][0]).toContain(
        ' test message',
    );
  });

  test("warns messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const warnger = new Logger(testNamespace, {}, {}, mockConsole);

    warnger.warn("test message");

    expect(mockConsole.warn.mock.calls[0][0]).toContain(
        ' test-namespace ',
    );
    expect(mockConsole.warn.mock.calls[0][0]).toContain(
        ' test message',
    );
  });


  test("errors messages with namespace prefix", () => {
    const mockConsole = createMockConsole();

    const errorger = new Logger(testNamespace, {}, {}, mockConsole);

    errorger.error("test message");

    expect(mockConsole.error.mock.calls[0][0]).toContain(
        ' test-namespace ',
    );
    expect(mockConsole.error.mock.calls[0][0]).toContain(
        ' test message',
    );
  });
});

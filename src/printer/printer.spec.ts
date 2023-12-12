import { describe, expect, test } from "vitest";
import { Printer } from "./printer";
import { defaultPalette } from "./palette";

class TestPrinter extends Printer {}

describe("Printer", function () {
  test("creates instance", () => {
    const printer = new TestPrinter("test", {
      console,
      palette: defaultPalette(),
      truncate: {
        maxPartLength: 10,
        maxPartLines: 10,
      },
    });

    expect(printer).toBeInstanceOf(TestPrinter);
  });
});

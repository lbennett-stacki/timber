import { describe, expect, test } from 'vitest'
import { Printer, defaultPalette } from "./printer";


class TestPrinter extends Printer {}

describe('Printer', function() {
  test('creates instance', () => {
      const printer = new TestPrinter('test', console, defaultPalette(), true, {
        'maxPartLength': 10,
        'maxPartLines': 10
      });

      expect(printer).toBeInstanceOf(TestPrinter);
  })
})
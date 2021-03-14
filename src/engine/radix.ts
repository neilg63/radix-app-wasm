import {
  convertToDozenalNotation,
  sanitizeRadixSource,
  truncateRadix,
} from "@/services/funcs";

export class FracParts {
  numerator = 0;
  denominator = 0;
  difference = 0;

  constructor(numer = 0, denom = 0, diff = 0) {
    if (numer > 0 || numer < 0) {
      this.numerator = numer;
    }
    if (denom > 0) {
      this.denominator = denom;
    }
    if (diff > 0) {
      this.difference = diff;
    }
  }

  get wholeNum() {
    if (Math.abs(this.numerator) > this.denominator && this.denominator > 0) {
      const frac = this.numerator / this.denominator;
      return this.numerator >= 0 ? Math.floor(frac) : Math.ceil(frac);
    } else {
      return 0;
    }
  }

  get hasWholeNum() {
    return this.wholeNum > 0 || this.wholeNum < 0;
  }

  get overNum() {
    const remNum = this.numerator % this.denominator;
    return this.hasWholeNum ? Math.abs(remNum) : remNum;
  }
}

export interface RadixFracParts {
  wholeNum: string;
  overNum: string;
  denominator: string;
  hasWholeNum: boolean;
}

export interface NumText {
  num: number;
  text: string;
}

export class RadixEngine {
  loaded = false;

  module: any = null;

  applyDozenalNotation = false;

  applyAlphaNumHexavigNotation = false;

  constructor(exported: any = null) {
    if (exported instanceof Object) {
      this.module = exported;
      this.loaded = true;
    }
  }

  toRadix(decVal: number, toBase = 12, sourceStr = ""): string {
    const str = this.loaded
      ? truncateRadix(
          this.module.decimal_to_radix(decVal, toBase),
          toBase,
          sourceStr
        )
      : "-";
    switch (toBase) {
      case 12:
        return this.applyDozenalNotation ? convertToDozenalNotation(str) : str;
      default:
        return str;
    }
  }

  toDec(source = "", radix = 10): number {
    return this.loaded
      ? this.module.radix_to_decimal(sanitizeRadixSource(source, radix), radix)
      : 0;
  }

  toFrac(num: number, precision = 4096): FracParts {
    const frac = this.loaded
      ? this.module.float_to_fraction(num, precision)
      : null;
    let numerator = 0;
    let denominator = 0;
    let difference = 0;
    if (frac instanceof Object) {
      numerator = frac.numerator();
      denominator = frac.denominator();
      difference = frac.difference();
    }
    return new FracParts(numerator, denominator, difference);
  }

  toRadixFrac(num: number, base = 12, precision = 4096): RadixFracParts {
    const frac = this.toFrac(num, precision);
    return {
      wholeNum: this.toRadix(frac.wholeNum, base),
      overNum: this.toRadix(frac.overNum, base),
      denominator: this.toRadix(frac.denominator, base),
      hasWholeNum: frac.hasWholeNum,
    };
  }

  radixToFrac(radVal: string, base = 12): NumText {
    const obj = this.loaded
      ? this.module.radix_fraction_to_radix(radVal, base)
      : null;
    let num = 0;
    let text = "";
    if (obj instanceof Object) {
      num = obj.as_float();
      text = obj.as_string();
    }
    return { num, text };
  }
}

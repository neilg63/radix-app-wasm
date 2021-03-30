import {
  buildBasePattern,
  sanitizeRadixSource,
  truncateRadix,
  smartConvertNotation,
} from "@/services/funcs";

const FRAC_PRECISION = 1024 * 256;

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
    return smartConvertNotation(str, toBase);
  }

  toDec(source = "", radix = 10): number {
    const decExpr = this.translateBaseNumbers(
      sanitizeRadixSource(source, radix),
      radix
    );
    return this.loaded ? this.module.expr_to_f64(decExpr) : 0;
  }

  numToDec(source = "", radix = 10): number {
    return this.loaded
      ? this.module.radix_to_decimal(sanitizeRadixSource(source, radix), radix)
      : 0;
  }

  parseRadix(expr: string, base = 12): number {
    const decExpr = sanitizeRadixSource(expr, base);
    return this.module.expr_to_radix(decExpr, 10);
  }

  translateBaseNumbers(expr: string, base = 12) {
    const pattern = buildBasePattern(base);
    const matches = expr.match(pattern);
    let out = expr;
    if (matches instanceof Array && matches.length > 0) {
      matches.forEach((m) => {
        try {
          const newVal = this.numToDec(m.toString(), base);
          const matchRgx = new RegExp("\\b" + m.toString() + "\\b", "i");
          out = out.replace(matchRgx, newVal.toString());
        } catch (e) {
          console.log(m.toString(), base, e);
        }
      });
    }
    return out;
  }

  parseExpr(expr: string): number {
    return this.module.expr_to_f64(expr);
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

  toRadixFrac(
    num: number,
    base = 12,
    precision = FRAC_PRECISION
  ): RadixFracParts {
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

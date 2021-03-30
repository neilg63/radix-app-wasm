import { RadixEngine } from "@/engine/radix";

const buildAlphaNumBasePatternStr = (base = 12) => {
  const lastDigit = base < 11 ? base - 1 : 9;
  const lastLetter = base < 11 ? "" : String.fromCharCode(97 + base - 11);
  const letters = base < 11 ? "" : "a-" + lastLetter;
  const letterGroup = "[0-" + lastDigit + letters + "]";
  return letterGroup + "+(\\." + letterGroup + "+)?";
};

const buildPairedBasePatternStr = (base = 60) => {
  const maxDec = Math.ceil(base / 10) - 1;
  const charRangeSet = "[0-" + maxDec + "]?[0-9]";
  const charGroupRepeat = "(:" + charRangeSet + ")*";
  const charGroup = charRangeSet + charGroupRepeat;
  return charGroup + "(\\." + charGroup + ")?";
};

export const buildBasePatternStr = (base = 12) => {
  return base <= 36
    ? buildAlphaNumBasePatternStr(base)
    : buildPairedBasePatternStr(base);
};

const matchUnitChar = (num: number) => {
  return num < 10 ? num.toString() : String.fromCharCode(97 + num - 10);
};

export const buildUnitSet = (base: number) => {
  const numItems = base <= 36 ? base : 10;
  const chars: string[] = [];
  for (let i = 0; i < numItems; i++) {
    chars.push(matchUnitChar(i));
  }
  return chars;
};

export const buildUpperUnitSet = (base: number) => {
  const numItems = base <= 36 ? 0 : Math.ceil(base / 10);
  const chars: string[] = [];
  for (let i = 0; i < numItems; i++) {
    chars.push(matchUnitChar(i + 10));
  }
  return chars;
};

export const buildBasePattern = (base = 12) => {
  return RegExp("\\b(" + buildBasePatternStr(base) + ")\\b", "gi");
};

const isValidExpr = (expr: string) => {
  let valid = /^-?\d+/.test(expr) && /\d+$/.test(expr);
  if (expr.includes("(") || expr.includes(")")) {
    const numOpening = (expr.match(/\(/g) || []).length;
    const numClosing = (expr.match(/\)/g) || []).length;
    valid = numOpening === numClosing;
  }
  return valid && !/\/\s*0\b/.test(expr);
};
const sanitizeExpr = (expr: string) => {
  return expr
    .replace(/([*/+])/g, " $1 ")
    .replace(/(\(|-)/g, " $1")
    .replace(/(\))/g, "$1 ")
    .replace(/\s\s+/g, " ")
    .trim();
};

export const evaluateExpression = (
  expr: string,
  base = 12,
  engine: RadixEngine
) => {
  let out = sanitizeExpr(expr);
  if (base !== 10) {
    out = engine.translateBaseNumbers(expr, base);
  }
  return isValidExpr(out) ? engine.parseRadix(out, base) : 0;
};

export const randomSourceString = () => {
  const strs = [
    "1000",
    "1 / 12",
    "6 * 9",
    "6 / 7",
    "1080",
    "1 + 2 / 3",
    "1024",
    "1728",
    "288",
    "576",
    "3 + (6 * 7)",
  ];
  const randIndex = Math.floor(Math.random() * strs.length * 0.9999);
  return strs[randIndex];
};

export const convertToDozenalNotation = (radixStr: string) => {
  return radixStr.replace(/[ad]/gi, "ð").replace(/[be]/gi, "ɛ");
};

export const convertToHexagesimalNotation = (radixStr: string) => {
  const rgx = /\b([0-5])([0-9])\b/gi;
  const ms = radixStr.match(rgx);

  if (ms instanceof Array) {
    for (const m of ms) {
      const dec = m.length > 1 ? m.substring(0, 1) : "";
      const unit = m.length > 1 ? m.substring(1, 2) : m.substring(0, 1);
      const decInt = dec.length > 0 ? parseInt(dec, 10) : 0;
      const decPart = String.fromCharCode(97 + decInt);
      const rgx = new RegExp("\\b" + m + "\\b", "gi");
      const repl = [decPart, unit].join("");

      console.log(rgx, repl, unit);
      radixStr = radixStr.replace(rgx, repl);
    }
  }
  return radixStr;
};

export const smartConvertNotation = (radixStr: string, base = 12) => {
  switch (base) {
    case 12:
      return convertToDozenalNotation(radixStr);
    case 60:
      return convertToHexagesimalNotation(radixStr);
    default:
      return radixStr;
  }
};

export const convertFromDozenalNotation = (radixStr: string) => {
  return radixStr.replace(/[dð]/gi, "a").replace(/[ɛe]/gi, "b");
};

export const convertToAplhanumHexavigNotation = (radixStr: string) => {
  return radixStr
    .split(".")
    .map((part) =>
      part
        .split(":")
        .map((sub) => {
          if (sub.length > 1) {
            const subChars = sub.split("");
            const firstInt = parseInt(subChars[0], 10);
            const firstChar = String.fromCharCode(97 + firstInt);
            return [firstChar, subChars[1]].join("");
          } else {
            return sub;
          }
        })
        .join(":")
    )
    .join(".");
};

export const sanitizeRadixSource = (source: string, radix = 12) => {
  switch (radix) {
    case 12:
      return convertFromDozenalNotation(source).trim();
    default:
      return source.trim();
  }
};

export const truncateRadix = (radixStr: string, radix = 12, sourceStr = "") => {
  if (sourceStr.length > 2 && sourceStr.includes(".")) {
    if (!/^.+[+*/^)(-]/.test(sourceStr)) {
      if (radixStr.length > sourceStr.length) {
        return sourceStr;
      }
    }
  }
  if (radix < 30) {
    if (radixStr.includes(".")) {
      const [first, second] = radixStr.split(".");
      const numPlaceValueUnits = second.length;
      if (numPlaceValueUnits > 13) {
        return [first, second.substring(0, 13)].join(".");
      }
    }
  }
  return radixStr;
};

import { RadixEngine } from "@/engine/radix";
import { Parser } from "expr-eval";

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
  return valid;
};
const sanitizeExpr = (expr: string) => {
  return expr
    .replace(/([*/+])/g, " $1 ")
    .replace(/(\(|-)/g, " $1")
    .replace(/(\))/g, "$1 ")
    .replace(/\s\s+/g, " ")
    .trim();
};

const parseExpr = (expr: string) => {
  let out = 0;
  try {
    out = Parser.evaluate(expr);
  } catch (e) {
    console.log(e);
  }
  return out;
};

export const evaluateExpression = (
  expr: string,
  base = 12,
  engine: RadixEngine
) => {
  let out = sanitizeExpr(expr);
  if (base !== 10) {
    const pattern = buildBasePattern(base);
    const matches = expr.match(pattern);
    if (matches instanceof Array && matches.length > 0) {
      matches.forEach((m) => {
        try {
          const newVal = engine.toDec(m.toString(), base);
          const matchRgx = new RegExp("\\b" + m.toString() + "\\b", "i");
          out = out.replace(matchRgx, newVal.toString());
        } catch (e) {
          console.log(m.toString(), base, e);
        }
      });
    }
  }
  return isValidExpr(out) ? parseExpr(out) : 0;
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
      return convertFromDozenalNotation(source);
    default:
      return source;
  }
};

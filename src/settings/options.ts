export interface NumValueName {
  value: number;
  name: string;
  label?: string;
  icon?: string;
  classNames?: string[];
}

export const radices = [2, 5, 6, 7, 8, 10, 12, 14, 16, 20, 30, 36, 60];

export const matchRadixLabel = (base: number) => {
  switch (base) {
    case 2:
      return "binary";
    case 5:
      return "quinary";
    case 6:
      return "senary";
    case 7:
      return "septenary";
    case 8:
      return "octal";
    case 10:
      return "decimal";
    case 12:
      return "duodecimal";
    case 14:
      return "tetradecimal";
    case 16:
      return "hexadecimal";
    case 20:
      return "vigesimal";
    case 30:
      return "trigesimal";
    case 36:
      return "hexatrigesimal";
    case 60:
      return "sexagesimal";
    default:
      return ["base", base].join("-");
  }
};

export const matchRadixAbbr = (base: number) => {
  switch (base) {
    case 2:
      return "binary";
    case 8:
      return "octal";
    case 10:
      return "dec";
    case 12:
      return "duodec";
    case 16:
      return "hexadec";
    case 20:
      return "vigesimal";
    case 30:
      return "trigesimal";
    case 60:
      return "sexagesimal";
    default:
      return ["base", base].join("-");
  }
};

const matchIcon = (base: number) => {
  if (base === 2) {
    return "pi-pause";
  } else if (base < 10) {
    return "pi-caret-left";
  } else if (base === 10) {
    return "pi-percentage";
  } else if (base === 12) {
    return "pi-clock";
  } else if (base === 16) {
    return "pi-sun";
  } else if (base <= 36) {
    return "pi-caret-right";
  } else {
    return "pi-compass";
  }
};

const currentYear = new Date().getFullYear();

export const radixOpts: NumValueName[] = radices.map((num) => {
  const name = matchRadixAbbr(num);
  const label = [num, matchRadixLabel(num)].join(": ");
  const icon = ["pi", matchIcon(num)].join(" ");
  const sizeClass =
    name.length > 8 ? "long" : name.length < 5 ? "short" : "medium";
  const classNames = [name, sizeClass];
  return { value: num, name, label, icon, classNames };
});

export const baseData = radices.map((num) => {
  const label = matchRadixLabel(num);
  return { value: num, label };
});

const matchLastDigit = (base = 10) => {
  return base - 1;
};

const matchLastChar = (base = 16) => {
  return String.fromCharCode(97 + base - 11);
};

export const matchHelpText = (base = 12) => {
  const exprHelp = `<li>You may enter expressions with common operators such as <em>+</em>, <em>-</em>, <em>*</em> and <em>/</em> and use parentheses, e.g. <em>(2 + 3)</em>, to group expressions.</em></li>`;
  switch (base) {
    case 12:
      return `<ul><li>For <em>ten (10)</em> type <em>d</em>, <em>ð</em> or <em>a</em></li><li>For <em>eleven (11)</em> type <em>e</em>, <em>ɛ</em> or <em>b</em></li><li>Type <em>0</em> to <em>9</em> for other unit values</li>${exprHelp}</ul>`;
    case 2:
    case 5:
    case 6:
    case 7:
    case 8:
    case 10:
      return `<ul><li>Use numbers between <em>0</em> and <em>${matchLastDigit(
        base
      )}</em></li>${exprHelp}</ul>`;
    case 60:
      return `<ul><li>Type numbers greater than 60 as colon-separated pairs of digits between <em>00</em> and <em>59</em>, e.g. <em>02:15</em> is <em>135</em> in decimal</li>${exprHelp}</ul>`;
    default:
      return `<ul><li>For number units between <em>10</em> and ${matchLastDigit(
        base
      )} type letters <em>a</em> to <em>${matchLastChar(
        base
      )}</em></li>${exprHelp}</ul>`;
  }
};

export const defaultCopyrightMarkup = `<span class="copyright first">© Neil Gardner ${currentYear}</span> <a href="https://www.multifaceted.info" target="_blank" class="developed-by second">Multifaceted Web Services</a>`;

type Script = "arabic" | "english" | "other";

const detectStartingLang = (text: string): Script => {
  if (!text) return "other";
  const firstChar = text.trim().charAt(0);

  if (!firstChar) return "other";

  const code = firstChar.charCodeAt(0);

  if (code >= 0x0620 && code <= 0x064a) {
    return "arabic";
  } else if (
    (code >= 0x0041 && code <= 0x005a) || // A-Z
    (code >= 0x0061 && code <= 0x007a) // a-z
  ) {
    return "english";
  } else {
    return "other";
  }
};
export default detectStartingLang;

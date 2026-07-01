const handlebars = require("handlebars");

module.exports = function fancyCommentsPack(plop, config) {
  const cfg = Object.assign(
    {
      prefix: "js-",
      upperCaseHeaders: false,
      commentStart: "/*",
      commentEnd: "*/",
    },
    config || {},
  );

  plop.setDefaultInclude({ helpers: true });

  plop.addHelper(`${cfg.prefix}multi-line-header`, multiLineHeader);
  plop.addHelper(`${cfg.prefix}header`, (text) =>
    multiLineHeader(String(text).split("\n")[0]),
  );
  plop.addHelper(`${cfg.prefix}header-end`, (text) => {
    const title = normalizeText(String(text).split("\n")[0]);
    const border = "==";
    const padding = "  ";
    const output = `${cfg.commentStart}${border}${padding}END ${title}${padding}${border}${cfg.commentEnd}`;

    return new handlebars.SafeString(output);
  });

  function multiLineHeader(text) {
    const lines = normalizeText(text).split("\n");
    const longestLine = Math.max(...lines.map((line) => line.length));
    const border = "==";
    const padding = "  ";
    const lineWidth = longestLine + border.length * 2 + padding.length * 2;
    let output = `${cfg.commentStart}${"=".repeat(lineWidth - cfg.commentStart.length)}`;

    output += `\n${border}${padding}`;
    output += lines
      .map((line) => line.padEnd(longestLine, " "))
      .join(`${padding}${border}\n${border}${padding}`);
    output += `${padding}${border}\n`;
    output += `${"=".repeat(lineWidth - cfg.commentEnd.length)}${cfg.commentEnd}`;

    return new handlebars.SafeString(output);
  }

  function normalizeText(text) {
    const value = String(text);
    return cfg.upperCaseHeaders ? value.toUpperCase() : value;
  }
};

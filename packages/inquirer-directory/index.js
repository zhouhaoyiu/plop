import fs from "node:fs";
import path from "node:path";
import InputPrompt from "inquirer/lib/prompts/input.js";

export default class DirectoryPrompt extends InputPrompt {
  constructor(question, rl, answers) {
    const basePath = path.resolve(question.basePath || process.cwd());
    const userFilter = question.filter;
    const userValidate = question.validate;

    super(
      {
        ...question,
        default: question.default ?? ".",
        filter: async (value, promptAnswers) => {
          const input = value || ".";
          const resolved = path.resolve(basePath, input);
          const relativePath = path.relative(basePath, resolved) || ".";

          if (userFilter) {
            return userFilter(relativePath, promptAnswers);
          }

          return relativePath;
        },
        validate: async (value, promptAnswers) => {
          const resolved = path.resolve(basePath, value || ".");

          if (!isInsideBasePath(basePath, resolved)) {
            return "Directory must be inside basePath";
          }

          if (!isDirectory(resolved)) {
            return "Directory does not exist";
          }

          if (userValidate) {
            return userValidate(value, promptAnswers);
          }

          return true;
        },
      },
      rl,
      answers,
    );
  }
}

function isDirectory(directoryPath) {
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch {
    return false;
  }
}

function isInsideBasePath(basePath, targetPath) {
  const relativePath = path.relative(basePath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

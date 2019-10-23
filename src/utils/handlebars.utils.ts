import { readFileSync } from 'fs';
import { compile } from 'handlebars';

export function readAndCompileHandlebarsTemplate(handlebarsTemplate: string) {
  const templateSource = readFileSync(handlebarsTemplate, "utf8");
  const template = compile(templateSource);
  return template;
}

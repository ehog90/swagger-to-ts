import program from 'commander';
import { readFileSync } from 'fs';
import { OpenAPIObject } from 'openapi3-ts';

import { flattenSchemas } from './flatten-schemas';
import { readAndCompileHandlebarsTemplate } from './utils';

program.option("-f, --file <file>", "swagger file location (local)");

program.parse(process.argv);

if (!program.file) {
  throw new Error("Filename must be provided");
}

const contract: OpenAPIObject = JSON.parse(readFileSync(program.file, "utf8"));

const schemas = flattenSchemas(contract);
const template = readAndCompileHandlebarsTemplate("./templates/interfaces.hbs");

schemas.forEach((schema) => {
  console.log(template({ schema }));
});

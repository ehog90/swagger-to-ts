import program from "commander";
import { appendFileSync, exists, existsSync, readFileSync, unlinkSync } from "fs";
import { OpenAPIObject, ReferenceObject, SchemaObject } from "openapi3-ts";

import { registerHelper, SafeString } from "handlebars";
import { flattenSchemas } from "./flatten-schemas";
import { readAndCompileHandlebarsTemplate } from "./utils";
import {
  extractTypeName,
  generateEnumName,
  generateInterfaceName,
  generateStringLiteralTypeName,
  getParentInterfaces,
  isEnum
} from "./utils/schema.utils";

program.option("-f, --file <file>", "swagger file location (local)");
program.option("-t, --target <file>", "target path for TS interfaces");

program.parse(process.argv);

if (!program.file) {
  throw new Error("Filename must be provided");
}

const openApiObject: OpenAPIObject = JSON.parse(readFileSync(program.file, "utf8"));

const schemas = flattenSchemas(openApiObject);

const enums = schemas.filter((s) => isEnum(s.schemaObject));
const interfaces = schemas.filter((s) => !isEnum(s.schemaObject));

registerHelper("extractTypeName", function(this: any, schema: SchemaObject | ReferenceObject) {
  return extractTypeName(schema, openApiObject);
});

registerHelper("generateInterfaceName", function(this: any, name: string) {
  return generateInterfaceName(name);
});

registerHelper("generateEnumName", function(this: any, name: string) {
  return generateEnumName(name);
});

registerHelper("generateStringLiteralTypeName", function(this: any, name: string) {
  return generateStringLiteralTypeName(name);
});

registerHelper("toStringLiteralType", function(this: any, values: string[]) {
  return new SafeString(values.map((v) => `'${v}'`).join(" | "));
});

registerHelper("generateInheritance", function(this: any, values: SchemaObject | ReferenceObject) {
  const parents = getParentInterfaces(values, openApiObject);
  if (!parents || parents.length === 0) {
    return "";
  }
  return ` extends ${parents.join(", ")}`;
});

const enumsTemplate = readAndCompileHandlebarsTemplate("./templates/enums.hbs");

const interfacesTemplate = readAndCompileHandlebarsTemplate("./templates/interfaces.hbs");

const sltTemplate = readAndCompileHandlebarsTemplate("./templates/string-literals.hbs");

if (existsSync(program.target)) {
  unlinkSync(program.target);
}

enums.forEach((_enum) => {
  appendFileSync(program.target, enumsTemplate({ _enum }));
});

enums.forEach((_enum) => {
  appendFileSync(program.target, sltTemplate({ _enum }));
});

interfaces.forEach((_interface) => {
  appendFileSync(program.target, interfacesTemplate({ _interface }));
});

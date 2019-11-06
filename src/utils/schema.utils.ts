import { isReferenceObject, isSchemaObject, OpenAPIObject, ReferenceObject, SchemaObject } from "openapi3-ts";
import { resolveReference } from "../process-schema";

export function isSimpleType(schemaObject: SchemaObject): boolean {
  return (
    schemaObject.type === "string" ||
    schemaObject.type === "number" ||
    schemaObject.type === "integer" ||
    schemaObject.type === "boolean"
  );
}

export function isInheritedObject(schemaObject: SchemaObject): boolean {
  return schemaObject.type === "object" && !!schemaObject.allOf;
}

export function getParentInterfaces(schemaObject: SchemaObject, openApiObject: OpenAPIObject): string[] | null {
  if (isInheritedObject(schemaObject) && schemaObject.allOf) {
    return schemaObject.allOf.map((s) => extractTypeName(s, openApiObject));
  }
  return null;
}

export function isEnum(schemaObject: object): boolean {
  return schemaObject.hasOwnProperty("enum");
}

export function extractSimpleType(type: string | undefined): string {
  switch (type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "integer":
    case "number":
      return "number";
    default:
      return "unknown";
  }
}
export function isArrayType(schemaObject: SchemaObject): boolean {
  return schemaObject.type === "array" && !!schemaObject.items;
}

export function generateInterfaceName(name: string) {
  return `I${name}`;
}

export function generateEnumName(name: string) {
  return name;
}
export function generateStringLiteralTypeName(name: string) {
  return `SLT_${name}`;
}

export function extractTypeName(schema: SchemaObject | ReferenceObject, openApiObject: OpenAPIObject): string {
  if (isReferenceObject(schema)) {
    const reference = resolveReference(schema.$ref, openApiObject);
    if (reference != null && !isEnum(reference.schemaObject)) {
      return generateInterfaceName(reference.key);
    }
    if (reference != null && isEnum(reference.schemaObject)) {
      return generateEnumName(reference.key);
    }
    return "unknown";
  } else if (isArrayType(schema)) {
    return `${extractTypeName(schema.items!, openApiObject)}[]`;
  } else if (isSimpleType(schema)) {
    return extractSimpleType(schema.type);
  } else if (schema.additionalProperties && schema.additionalProperties !== true) {
    return `{[key: string]: ${extractTypeName(schema.additionalProperties, openApiObject)}}`;
  }
  return "unknown";
}

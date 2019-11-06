import { OpenAPIObject } from "openapi3-ts";
import { ISchema } from "./entities";
import { maybe } from "./utils";

export function resolveReference(schemaRef: string, schemas: OpenAPIObject): ISchema | null {
  const schemaRefPath = schemaRef.split("/").filter((p) => p !== "" && p !== "#");
  const schema = schemaRefPath.reduce((prev, curr) => prev.map((p) => p[curr]), maybe(schemas as any));
  return schema
    .map((s) => ({ schemaObject: s, ref: schemaRef, key: schemaRefPath[schemaRefPath.length - 1] } as ISchema | null))
    .orElse(null);
}

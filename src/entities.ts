import { SchemaObject } from "openapi3-ts";

export interface ISchema {
  readonly schemaObject: SchemaObject;
  readonly ref: string;
  readonly key: string;
}

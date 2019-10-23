import { OpenAPIObject } from 'openapi3-ts';

import { ISchema } from './entities';
import { maybe } from './utils';

export function flattenSchemas(originalOpenAPIObject: OpenAPIObject): ISchema[] {
  const schemas = maybe(originalOpenAPIObject)
    .map((c) => c.components!)
    .map((c) => c.schemas)
    .orElse({});

  const flattenedSchemas: ISchema[] = [];
  for (const schemaKey in schemas) {
    if (schemas[schemaKey]) {
      const schema: ISchema = {
        key: schemaKey,
        ref: `#/components/schemas/${schemaKey}`,
        schemaObject: schemas[schemaKey],
      };
      flattenedSchemas.push(schema);
    }
  }
  return flattenedSchemas;
}

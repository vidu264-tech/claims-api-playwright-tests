import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateSchema(schema: any, data: any) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid: !!valid, errors: validate.errors };
}

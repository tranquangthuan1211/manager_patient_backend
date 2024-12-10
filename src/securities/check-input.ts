export function checkInputError<T>(
    input: Partial<T>, 
    schema: { [K in keyof T]: string }
  ): { valid: boolean; errors: { field: keyof T; message: string }[] } {
    const errors: { field: keyof T; message: string }[] = [];
    for (const key in schema) {
      const expectedType = schema[key];
      const value = input[key];
      if (value === undefined || value === null) {
        errors.push({ field: key, message: "Field is missing or null" });
        continue;
      }
  
      const actualType =
        Array.isArray(value) ? "array" : typeof value;
      if (actualType !== expectedType) {
        errors.push({
          field: key,
          message: `Expected ${expectedType}, got ${actualType}`,
        });
      }
    }
  
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  
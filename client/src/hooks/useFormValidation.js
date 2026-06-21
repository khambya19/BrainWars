export function useFormValidation(schema, values, touched) {
  const result = schema.safeParse(values)

  const fieldErrors = result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((e) => [e.path[0], e.message]))

  function getFieldState(field) {
    if (!touched[field] || !values[field]) return {}
    return fieldErrors[field] ? { error: fieldErrors[field] } : { success: true }
  }

  return { isValid: result.success, fieldErrors, getFieldState }
}

function Type(name, xtra) {
  this.name = name;
  if (xtra) {
    if (xtra.optional) this.OPTIONAL = new Type(`${name}.OPTIONAL`);
    if (xtra.nullable) this.NULLABLE = new Type(`${name}.NULLABLE`);
    if (xtra.optional && xtra.nullable) {
      this.NULLABLE.OPTIONAL = this.OPTIONAL.NULLABLE = new Type(`${name}.OPTIONAL.NULLABLE`);
    }
    if (xtra.nonempty) this.NONEMPTY = new Type(`${name}.NONEMPTY`);
    if (xtra.nonempty && xtra.nullable) {
      this.NONEMPTY.NULLABLE = this.NULLABLE.NONEMPTY = new Type(`${name}.NONEMPTY.NULLABLE`);
    }
  }
}

export const TYPES = {
  STRING: new Type('STRING', {
    optional: true, nonempty: true, nullable: true,
  }),
  NUMBER: new Type('NUMBER', {
    optional: true, nullable: true,
  }),
  INTEGER: new Type('INTEGER', {
    optional: true, nullable: true,
  }),
  BOOLEAN: new Type('BOOLEAN', {
    optional: true, nullable: true,
  }),
  ARRAY: new Type('ARRAY', {
    optional: true, nonempty: true, nullable: true,
  }),
  OBJECT: new Type('OBJECT', {
    optional: true, nonempty: true, nullable: true,
  }),
  DATE: new Type('DATE', {
    optional: true, nonempty: true, nullable: true,
  }), // always nonempty
  MIXED: new Type('MIXED', {
    optional: true, nonempty: true, nullable: true,
  }), // always nonempty
  NOTEXISTS: new Type('NOTEXISTS'),
};

export const isString = (target) => typeof target === 'string';
export const isNonEmptyString = (target) => !!(isString(target) && target);
export const isRegExp = (target) => target instanceof RegExp;
export const isNumber = (target) => !!(typeof target === 'number' && isFinite(target));
export const isNaNNumber = (target) => !!(typeof target === 'number' && isNaN(target));
export const isInteger = (target) =>
  isNumber(target) && Math.floor(target) === target &&
  Math.abs(target) <= Number.MAX_SAFE_INTEGER;
export const isBoolean = (target) => typeof target === 'boolean';
export const isArray = (target) => Array.isArray(target);
export const isNonEmptyArray = (target) => isArray(target) && target.length > 0;
export const isObject = (target) => !!(target && target.constructor === Object); // array excluded
export const isNonEmptyObject = (target) => isObject(target) && Object.keys(target).length > 0;
export const isDate = (target) => target instanceof Date && !isNaN(target.getTime());
export const isMixed = (target) => (
  isString(target) || isNumber(target) || isBoolean(target) ||
  isArray(target) || isObject(target) || isDate(target)
);

export const like = (target, ...specs) => {
  const {
    STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT, DATE, MIXED, NOTEXISTS,
  } = TYPES;

  return specs.some((spec) => {
    switch (spec) {
      case STRING:
        return isString(target);
      case STRING.OPTIONAL:
        if (target === undefined) return true;
        return isString(target);
      case STRING.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isString(target);
      case STRING.NONEMPTY:
        return isNonEmptyString(target);
      case STRING.NULLABLE:
        if (target === null) return true;
        return isString(target);
      case STRING.NONEMPTY.NULLABLE:
        if (target === null) return true;
        return isNonEmptyString(target);

      case NUMBER:
        return isNumber(target);
      case NUMBER.OPTIONAL:
        if (target === undefined) return true;
        return isNumber(target);
      case NUMBER.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isNumber(target);
      case NUMBER.NULLABLE:
        if (target === null) return true;
        return isNumber(target);

      case INTEGER:
        return isInteger(target);
      case INTEGER.OPTIONAL:
        if (target === undefined) return true;
        return isInteger(target);
      case INTEGER.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isInteger(target);
      case INTEGER.NULLABLE:
        if (target === null) return true;
        return isInteger(target);

      case BOOLEAN:
        return isBoolean(target);
      case BOOLEAN.OPTIONAL:
        if (target === undefined) return true;
        return isBoolean(target);
      case BOOLEAN.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isBoolean(target);
      case BOOLEAN.NULLABLE:
        if (target === null) return true;
        return isBoolean(target);

      case ARRAY:
        return isArray(target);
      case ARRAY.OPTIONAL:
        if (target === undefined) return true;
        return isArray(target);
      case ARRAY.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isArray(target);
      case ARRAY.NONEMPTY:
        return isNonEmptyArray(target);
      case ARRAY.NULLABLE:
        if (target === null) return true;
        return isArray(target);

      case OBJECT:
        return isObject(target);
      case OBJECT.OPTIONAL:
        if (target === undefined) return true;
        return isObject(target);
      case OBJECT.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isObject(target);
      case OBJECT.NONEMPTY:
        return isNonEmptyObject(target);
      case OBJECT.NULLABLE:
        if (target === null) return true;
        return isObject(target);

      case DATE:
        return isDate(target);
      case DATE.OPTIONAL:
        if (target === undefined) return true;
        return isDate(target);
      case DATE.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isDate(target);
      case DATE.NONEMPTY:
        return isDate(target); // Date object is always nonempty
      case DATE.NULLABLE:
        if (target === null) return true;
        return isDate(target);

      case MIXED:
        return isMixed(target);
      case MIXED.OPTIONAL:
        if (target === undefined) return true;
        return isMixed(target);
      case MIXED.OPTIONAL.NULLABLE:
        if (target === undefined || target === null) return true;
        return isMixed(target);
      case MIXED.NONEMPTY:
        return isMixed(target); // Mixed object is always nonempty
      case MIXED.NULLABLE:
        if (target === null) return true;
        return isMixed(target);

      case NOTEXISTS:
        return target === undefined;

      default:
        if (typeof spec === 'function') return spec(target);
        if (isObject(spec) && isObject(target)) {
          return Object.keys(spec).every((k) => like(target[k], spec[k]));
        }
        if (isArray(spec) && isArray(target)) {
          if (spec.length === 0) return true; // vacuous truth
          if (target.length === 0) return false;
          return target.every((t) => like(t, spec[0]));
        }
        if (isNaNNumber(target) && isNaNNumber(spec)) return true;
        if (isString(target) && isRegExp(spec) && spec.test(target)) return true;
        return target === spec;
    }
  });
};

export const likeThrow = (...args) => {
  if (!like(...args)) throw new Error('type mismatch');
};

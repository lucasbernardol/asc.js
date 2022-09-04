export const _Prototype = () => Object.prototype;
export const _NumberPrototype = () => Number.prototype;
export const _StrictTypeString = (value: unknown) => _Prototype().toString.call(value);
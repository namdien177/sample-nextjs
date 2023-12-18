export type ObjectValue<T extends Record<string, unknown>> = T[keyof T];

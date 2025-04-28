export const countries = ['cn', 'de', 'us', 'ru', 'tw', 'sg', 'in', 'i2'] as const;
export type Country = (typeof countries)[number];

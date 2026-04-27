export type CountryLike = {
  country: string;
};

export function getCountryOptions(items: readonly CountryLike[] | undefined): string[] {
  return Array.from(new Set((items ?? []).map(({ country }) => country))).sort();
}

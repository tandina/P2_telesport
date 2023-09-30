export interface olympicCountryType {
  id: number;
  country: string;
  participations: {
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
  }[];
}

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
// export interface Participation {
//   id: number;
//   year: number;
//   city: string;
//   medalsCount: number;
//   athleteCount: number;
// }
// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

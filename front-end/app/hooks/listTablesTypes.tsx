export enum ListType {
  Exclusion = 'exclusion',
  Saved = 'saved',
  Seen = 'seen',
  Previous = 'previous'
}

export interface Title {
  TitleId: string
  Title: string
  PosterURL: string
  Plot: string
  Type: string
  Actors: string
  IMDbId: string
  Rating: string
  Writer: string
  Runtime: string
  Director: string
  MetaScore: number
  ReleaseYear: number
}

export type MovieProps = {
  id: number;
  title: string;
  description?: string | null;
  releaseDate: Date;
  imageUrl: string;
  classification: number;
  rating: number;
  trailerUrl?: string | null;
  duration: number;
  revenue: number;
  budget: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  genres: string[];
};

export class Movie {
  readonly id: number;
  readonly title: string;
  readonly description?: string | null;
  readonly releaseDate: Date;
  readonly imageUrl: string;
  readonly classification: number;
  readonly rating: number;
  readonly trailerUrl?: string | null;
  readonly duration: number;
  readonly revenue: number;
  readonly budget: number;
  readonly language: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly userId: number;
  readonly genres: string[];

  constructor(props: MovieProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.releaseDate = props.releaseDate;
    this.imageUrl = props.imageUrl;
    this.classification = props.classification;
    this.rating = props.rating;
    this.trailerUrl = props.trailerUrl;
    this.duration = props.duration;
    this.revenue = props.revenue;
    this.budget = props.budget;
    this.language = props.language;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.userId = props.userId;
    this.genres = props.genres;
  }
}

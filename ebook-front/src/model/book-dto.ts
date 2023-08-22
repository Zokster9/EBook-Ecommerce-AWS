export interface BookDTO {
  id: number;
  title: string;
  description: string;
  isbn: string;
  quantity: number;
  available: number;
  cover?: string;
  publishDate: Date;
  price: number;
  genres: string[];
  authors: { firstName: string; lastName: string }[];
}

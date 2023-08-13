export interface BookDb {
  book_id: number;
  title: string;
  description: string;
  isbn: string;
  quantity: number;
  available: number;
  cover?: string;
  publish_date: Date;
  price: number;
  genrenames: string[];
  authornames: string[];
}

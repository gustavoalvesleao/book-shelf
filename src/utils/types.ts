export interface User {
  id: string;
  token: string;
  username: string;
}

export interface Book {
  title: string;
  author: string;
  coverImageUrl: string;
  id: string;
  pageCount: number;
  publisher: string;
  synopsis: string;
}

export interface ListItem {
  id: string;
  bookId: string;
  ownerId: string;
  rating: number;
  notes: string;
  finishDate: number | null;
  startDate: number;
  book: Book;
}

export interface NetworkError {
  status: number;
  message: string;
}

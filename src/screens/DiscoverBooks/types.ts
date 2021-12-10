import { Book } from "utils/types";

export interface FormElements extends HTMLFormControlsCollection {
  search: HTMLInputElement;
}
export interface SearchFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

export interface Data {
  books: Array<Book>;
}

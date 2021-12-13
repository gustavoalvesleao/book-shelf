export interface FormElements extends HTMLFormControlsCollection {
  search: HTMLInputElement;
}
export interface SearchFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

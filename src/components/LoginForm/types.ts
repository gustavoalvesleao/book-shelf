export interface FormData {
  username: string;
  password: string;
}

export interface FormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  buttonText: string;
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}
export interface LoginFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

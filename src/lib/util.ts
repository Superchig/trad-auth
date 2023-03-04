export const submitWithEnter = (event: KeyboardEvent, form: HTMLFormElement) => {
  if (event.key == 'Enter') {
    form.submit();
  }
};

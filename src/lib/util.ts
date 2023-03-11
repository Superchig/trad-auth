export const submitWithEnter = (
  event: KeyboardEvent,
  form: HTMLFormElement,
) => {
  if (event.key == 'Enter') {
    // NOTE(Chris): This is identical to using a submit button
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
    form.requestSubmit();
  }
};

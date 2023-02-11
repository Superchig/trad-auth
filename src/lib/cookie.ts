type CookieOptions = {
  sameSite?: 'Lax' | 'Strict' | 'None';
  expires?: Date;
};

const defaultCookieOptions: CookieOptions = {
  sameSite: 'Strict'
};

// NOTE(Chris): Modified from getCookieValue at
// https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript?rq=1
export const getCookieUnsafe = (name: string): string | undefined =>
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop();

export const setCookieUnsafe = (name: string, value: string, options: CookieOptions = {}): void => {
  let cookieOptions = {
    ...defaultCookieOptions,
    ...options
  };

  let cookieString = `${name}=${value}`;

  if (cookieOptions.sameSite) {
    cookieString += `; SameSite=${cookieOptions.sameSite}`;
  }
  if (cookieOptions.expires) {
    cookieString += `; Expires=${cookieOptions.expires}`;
  }

  document.cookie = cookieString;
};

type CookieName = 'sessionId';

// NOTE(Chris): The type-checking here will allow us to avoid typos
export const getCookieSafe = (name: CookieName): string | undefined => getCookieUnsafe(name);

export const setCookieSafe = (
  name: CookieName,
  value: string,
  options: CookieOptions = {}
): void => {
  setCookieUnsafe(name, value, options);
};

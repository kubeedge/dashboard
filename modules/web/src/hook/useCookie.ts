import { useState, useEffect } from 'react';

interface CookieOptions {
  expires?: string | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const useCookie = (cookieName: string): [string | undefined, (value: string, options?: CookieOptions) => void] => {
  const [cookieValue, setCookieValue] = useState<string | undefined>(undefined);

  const setCookie = (value: string, options?: CookieOptions) => {
    if (value === undefined || value === null) {
      // If value is undefined or null, delete the cookie
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setCookieValue(undefined);
      return;
    }

    const cookieOptions = options ? options : {};
    document.cookie = `${cookieName}=${value}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;
    setCookieValue(value);
  };

  useEffect(() => {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    const cookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
    if (cookie) {
      const cookieValue = cookie.split('=')[1];
      setCookieValue(cookieValue);
    }
  }, [cookieName]);

  return [cookieValue, setCookie];
};

export default useCookie;

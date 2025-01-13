
export const setCookie = (name: string, value: string, days: number): void => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
    const value = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
    return value ? decodeURIComponent(value[1]) : null;
};

export const deleteCookie = (name: string): void => {
    setCookie(name, '', -1);
};
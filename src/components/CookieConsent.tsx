import { useEffect } from 'react';

const CookieConsent = () => {
    useEffect(() => {
        const banner = document.getElementById('cookie-banner');
        if (!banner || localStorage.getItem('cookieConsent')) {
            return;
        }

        banner.style.display = 'flex';
    }, []);

    const handleAccept = () => {
        const banner = document.getElementById('cookie-banner');
        localStorage.setItem('cookieConsent', 'true');
        if (banner) {
            banner.style.display = 'none';
        }
    };

    return (
        <div
            id="cookie-banner"
            className="fixed bottom-5 left-0 right-0 mx-auto max-w-md bg-gray-800 text-white p-5 rounded-lg shadow-lg hidden z-50"
        >
            <p className="m-0">
                To strona korzysta z plików cookies. Więcej w <a href="/privacy" className="text-blue-300 hover:text-blue-400">
                    Polityce Prywatności
                </a>.
            </p>
            <button
                onClick={handleAccept}
                className="ml-5 bg-gray-600 text-white border-0 rounded cursor-pointer px-4 py-2 hover:bg-gray-700"
            >
                Ok!
            </button>
        </div>
    );
};

export { CookieConsent };

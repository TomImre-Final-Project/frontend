import axios from "axios";

//létrehozunk egy új Axios példányt a create metódus segítségével.
export const myAxios = axios.create({
    // alap backend api kiszolgáló elérési útjának beállítása
    baseURL: "http://localhost:8000",
    
    //beállítjuk, hogy  a kérések azonosítása coockie-k segítségével történik.
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

myAxios.interceptors.request.use(
    async (config) => {
        // For auth endpoints, ensure we have the CSRF cookie
        if (['/login', '/register', '/logout'].includes(config.url)) {
            try {
                await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                    withCredentials: true
                });
            } catch (error) {
                console.error('Failed to fetch CSRF cookie:', error);
            }
        }

        // Get CSRF token from cookie
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='));
        
        if (token) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token.split('=')[1]);
        }

        return config;
    },
    (error) => {
        // Hiba esetén írjuk ki a hibát, vagy végezzünk hibakezelést
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
myAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 500) {
            console.error('Server error:', error.response?.data);
        }
        if (error.response?.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = '/bejelentkezes';
        }
        return Promise.reject(error);
    }
);
// utils/withAuth.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            // Check authentication status here
            const isAuthenticated = localStorage.getItem('authToken');

            if (!isAuthenticated) {
                router.replace('/login'); // Redirect to login page
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

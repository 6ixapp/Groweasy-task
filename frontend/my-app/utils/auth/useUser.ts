import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { API_URL } from '@/constants/config';

interface User {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
}

export default function useUser() {
    const { auth } = useAuth();

    return useQuery<User>({
        queryKey: ['user', auth],
        queryFn: async () => {
            if (!auth) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            return response.json();
        },
        enabled: !!auth,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Colors } from 'types';

const BE_BASE_URL = process.env.BE_BASE_URL || 'http://localhost:3005';

export function useColors(image: string | undefined) {
    return useQuery<Colors>({
        queryKey: ['colors'],
        queryFn: async () => {
            return axios
                .get(`${BE_BASE_URL}/colors`, {
                    params: { imageUrl: encodeURI(image as string) },
                })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error('Failed to fetch colors', error);
                });
        },
        enabled: !!image,
    });
}

export function useUpdateColor() {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['colors'],
        mutationFn: async (imageUrl: string) => {
            return axios
                .get<Colors>(`${BE_BASE_URL}/colors`, {
                    params: { imageUrl: encodeURI(imageUrl) },
                })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error('Failed to fetch colors', error);
                });
        },
        onSuccess: (data) => {
            // queryClient.setQueryData(['colors'], data);
        },
    });
}

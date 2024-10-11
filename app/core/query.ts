import { QueryClient, QueryKey } from '@tanstack/react-query';
import {DIRECTUS_BASE_URL} from "@/app/core/constants";
import {GraphQLClient} from "graphql-request";
import * as SecureStore from "expo-secure-store";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            /**
             * StaleTime: The duration until a query transitions from fresh to stale.
             * As long as the query is fresh, data will always be read from the cache only - no network request will happen!
             * If the query is stale (which per default is: instantly),
             * you will still get data from the cache, but a background refetch can happen under certain conditions.
             */
            staleTime: 1000 * 60 * 5, // 5 minutes
            /**
             * CacheTime: The duration until inactive queries will be removed from the cache.
             * This defaults to 5 minutes.
             * Queries transition to the inactive state as soon as there are no observers registered,
             * so when all components which use that query have unmounted.
             */
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

export const REACT_QUERY_OFFLINE_CACHE = 'REACT_QUERY_OFFLINE_CACHE';

const systemKeys = [
    'mutation Login(', // Login mutation
    'mutation Logout(', // Logout mutation
    'mutation RefreshAccessToken(', // RefreshAccessToken mutation
    'mutation ResetPassword(', // ResetPassword mutation
    'mutation Signup(', // SignUp mutation
    'mutation DeleteUser(', // DeleteUser mutation
    'mutation UpdateUser(', // UpdateUser mutation
    'query FetchMe ', // FetchMe query
    'query FetchUserById(', // FetchUserById query
    'query FetchCommunityUsers(', // FetchCommunityUsers query
];

const isSystemQuery = (queryKey: string) =>
    systemKeys.some((key) => queryKey.includes(key));

export const graphqlClient = new GraphQLClient(`${DIRECTUS_BASE_URL}/graphql`);

export const fetchData =
    <TData, TVariables>(
        query: string,
        variables?: TVariables,
        options?: RequestInit['headers']
    ): (() => Promise<TData>) =>
        async () => {
            const URL = isSystemQuery(query)
                ? `${DIRECTUS_BASE_URL}/graphql/system`
                : `${DIRECTUS_BASE_URL}/graphql`;

            graphqlClient.setEndpoint(URL);

            if (options) {
                graphqlClient.setHeaders(options);
            }
            const sess = SecureStore.getItem('session');
            const session = sess ? JSON.parse(sess) : null;

            if (session) {
                graphqlClient.setHeader('Authorization', `Bearer ${session.accessToken}`);
            }

            graphqlClient.setHeader('credentials', 'same-origin');
            graphqlClient.setHeader('GraphQL-Client-Name', 'app');

            return graphqlClient.request(query, variables);
        };

export const invalidateQueries = (key?: QueryKey) =>
    queryClient.invalidateQueries(key);

export const removeQueries = (key?: QueryKey) => queryClient.removeQueries(key);

export const setAuthHeader = (accessToken?: string) => {
    if (!accessToken) {
        graphqlClient.setHeader('Authorization', undefined);
    } else {
        graphqlClient.setHeader('Authorization', `Bearer ${accessToken}`);
    }
};

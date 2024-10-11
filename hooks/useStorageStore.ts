import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

async function getStorageItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Local storage is unavailable:', e);
            return null;
        }
    } else {
        return await SecureStore.getItemAsync(key);
    }
}

async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
    const [state, setState] = useAsyncState<T>();

    useEffect(() => {
        (async () => {
            const value = await getStorageItemAsync(key);
            setState(value ? JSON.parse(value) : null);
        })();
    }, [key]);

    const setValue = useCallback(
        async (value: T | null) => {
            setState(value);
            const jsonValue = value !== null ? JSON.stringify(value) : null;
            await setStorageItemAsync(key, jsonValue);
        },
        [key]
    );

    return [state, setValue];
}
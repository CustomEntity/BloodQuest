import {Slot} from 'expo-router';
import {SessionProvider} from "@/ctx";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// SplashScreen.preventAutoHideAsync();

export default function Root() {
    const [loaded, error] = useFonts({
        'DelaGothicOne': require('@/assets/fonts/DelaGothicOne-Regular.ttf'),
        'ADLaMDisplay': require('@/assets/fonts/ADLaMDisplay-Regular.ttf'),
    });

    const queryClient = new QueryClient();

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                    <BottomSheetModalProvider>
                        <Slot/>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SessionProvider>
        </QueryClientProvider>
    );
}

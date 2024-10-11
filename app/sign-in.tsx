import React, {useState} from 'react';
import {router} from 'expo-router';
import {Text, View, Dimensions, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import {useSession} from "@/ctx";
import Svg, {Path, Defs, LinearGradient, Stop} from "react-native-svg";
import tw from 'twrnc';
import {Image} from "expo-image";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {horizontalScale, verticalScale} from "@/utils/dimensionsUtils";
import {useLoginMutation} from "@/graphql/generated/graphql";

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const SvgComponent: React.FC = (props) => (
    <Svg
        width={screenWidth + 10}
        height={verticalScale(520)}
        fill="none"
        {...props}
    >
        <Path
            fill="url(#a)"
            fillRule="evenodd"
            d="M480 402.5c93.155 79.039 6.432 106.415-74 174-78.522 65.981-155.741 61.866-243.336 18-71.838-35.975-161.3 24.34-188.164-55 0 0-1.391-187.288 12.5-264 18.084-99.865-4.162-238.604 88-269 98.719-32.558 90.733 75.602 185.5 112.5 81.585 31.765 152.065-122.387 201-47 46.921 72.285 39.222 243.118 18.5 330.5Z"
            clipRule="evenodd"
        />
        <Defs>
            <LinearGradient
                id="a"
                x1={344.917}
                x2={155.638}
                y1={22.848}
                y2={624.339}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#C12631"/>
                <Stop offset={1} stopColor="#E43E3A"/>
            </LinearGradient>
        </Defs>
    </Svg>
)

export default function SignIn(): React.ReactElement {
    const { signIn } = useSession();
    const safeAreaInsets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loginMutation = useLoginMutation({
        onSuccess: (data) => {
            if (data.auth_login?.access_token && data.auth_login?.refresh_token && data.auth_login?.expires) {
                signIn({
                    accessToken: data.auth_login.access_token,
                    refreshToken: data.auth_login.refresh_token,
                    expires: data.auth_login.expires,
                });
                router.replace('/');
                console.log('Connexion réussie');
            } else {
                setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
                console.error('Erreur lors de la connexion:', data);
            }
        },
        onError: (error) => {
            console.error('Erreur de connexion:', error);
            setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
            console.log('Erreur de connexion:', error);
        }
    });

    const handleSignIn = () => {
        console.log('Connexion en cours...');
        setErrorMessage('');
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        loginMutation.mutate({ email, password });
    };

    return (
        <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#FFE2E2]`}>
            <View style={tw`absolute w-full bottom-0 left-0`}>
                <SvgComponent/>
            </View>
            <Image
                source={require('../assets/images/logo.png')}
                style={tw`absolute w-[311px] h-[204px] top-[${safeAreaInsets.top + 20}px]`}
                contentFit='contain'
            />

            <View style={tw`absolute w-full w-3/5 bottom-${verticalScale(30)}`}>
                {errorMessage ? (
                    <Text style={tw`text-white text-center mb-4`}>{errorMessage}</Text>
                ) : null}
                <TextInput
                    placeholderTextColor={'#FAFAFA9C'}
                    style={tw`border-b border-white h-12 mb-4`}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholderTextColor={'#FAFAFA9C'}
                    style={tw`border-b border-white h-12 mb-4`}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={tw`py-4 rounded-full border-white border-2 mt-4 w-4/5 mx-auto`}
                    onPress={handleSignIn}
                >
                    <Text style={tw`text-white text-center font-bold uppercase`}>Se connecter</Text>
                </TouchableOpacity>
                <View style={tw`flex-row gap-3 justify-center pt-6 `}>
                    <Text style={tw`text-center mt-4 text-white uppercase`}>
                        Pas de compte ?
                    </Text>
                    <Text style={tw`text-center mt-4 text-white underline uppercase font-bold`}>S'inscrire</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
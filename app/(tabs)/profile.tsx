import React, { useState, useEffect } from 'react';
import {Pressable, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackgroundForm from "@/components/BackgroundForm";
import {useSession} from "@/ctx";
import {FontAwesome6} from "@expo/vector-icons";

const BadgeItem = ({ source, title, backgroundColor = '#ED4141' }) => (
    <View style={tw`flex-row bg-[${backgroundColor}] w-full rounded-[12px] h-12 overflow-hidden px-3 py-1`}>
        <View style={tw`h-full aspect-square justify-center items-center`}>
            <Image
                source={source}
                style={tw`h-10 w-10`}
                contentFit='contain'
            />
        </View>
        <View style={tw`flex-1 justify-center px-4`}>
            <Text style={tw`text-lg text-white`}>
                {title}
            </Text>
        </View>
    </View>
);

const SectionTitle = ({ title }) => (
    <Text
        style={[tw`text-white text-3xl font-bold`, {
            fontFamily: 'DelaGothicOne'
        }]}
    >
        {title}
    </Text>
);

export default function Profile() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date('2024-10-31T23:59:59').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const session = useSession();
    return (
        <SafeAreaView style={tw`flex-1 bg-[#FFE2E2]`}>
            <BackgroundForm />
            <ScrollView contentContainerStyle={tw`flex-1 gap-4 z-10`}>
                <View style={tw`items-center pt-4`}>
                    <Image
                        source={require('../../assets/images/character.png')}
                        style={tw`w-[60px] h-[77px]`}
                        contentFit='contain'
                    />
                    <Text style={tw`text-3xl font-bold text-center text-[#3C0B0B]`}>Profil</Text>
                </View>
                <View style={tw`gap-8`}>
                    <Image
                        source={require('../../assets/images/profileStats.png')}
                        style={tw`w-full h-[200px]`}
                    />
                    <View style={tw`flex-col w-full px-8 gap-8`}>
                        <View style={tw`flex-col w-full gap-3`}>
                            <SectionTitle title="Mes badges" />
                            <View style={tw`flex-col gap-4`}>
                                <BadgeItem
                                    source={require('../../assets/images/badge-1.png')}
                                    title="Marathon du Don"
                                /><BadgeItem
                                    source={require('../../assets/images/badge-2.png')}
                                    title="Raider héroïque"
                                /><BadgeItem
                                    source={require('../../assets/images/badge-3.png')}
                                    title="Gardien du plasma"
                                />
                            </View>
                        </View>
                        <View style={tw`flex-col w-full gap-3`}>
                            <SectionTitle title="Mes communautés" />
                            <View style={tw`flex-col gap-4`}>
                                <BadgeItem
                                    source={require('../../assets/images/community.png')}
                                    title="Université Montpellier III"
                                    backgroundColor="#3C0B0B"
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <Pressable
                    onPress={() => session.signOut()}
                    style={tw`absolute right-5 top-5 z-10`}>
                    <FontAwesome6 name={'door-open'} size={30} color={'#3C0B0B'} />
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
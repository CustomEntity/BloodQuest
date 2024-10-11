import React, { useState, useRef } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CampaignDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [shareCount, setShareCount] = useState(1024);
    const [expanded, setExpanded] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const campaignDetails = {
        image: require('../../../assets/images/campaign-1.png'),
        title: "Ensemble, battons des records",
        content: "En 2024, l'EFS vit au rythme du sport ! Clubs mythiques et fédérations sportives s'associent à l'Établissement français du sang pour une grande campagne de mobilisation autour du don de sang. L'objectif ? Battre des records de générosité en collectant 10 000 dons par jour, soit 1 million de poches de sang sur toute la durée des Jeux Olympiques et Paralympiques de Paris 2024. Ensemble, relevons ce défi et sauvons des vies !",
        goal: 10000,
        current: 7500,
    };

    const progress = (campaignDetails.current / campaignDetails.goal) * 100;

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [300, 100],
        extrapolate: 'clamp'
    });

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <Animated.View style={[tw`absolute top-0 left-0 right-0 z-10`, { height: headerHeight }]}>
                <Image
                    source={campaignDetails.image}
                    style={tw`w-full h-full`}
                    contentFit="cover"
                />
            </Animated.View>
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                style={tw`flex-1`}
                contentContainerStyle={tw`pt-[300px]`}
            >
                <View style={tw`bg-white rounded-t-3xl -mt-8 p-6`}>
                    <Text style={tw`text-3xl font-bold text-[#3C0B0B] mb-4`}>
                        {campaignDetails.title}
                    </Text>
                    <Text style={tw`text-base text-[#3C0B0B] mb-6 ${expanded ? '' : 'h-20'}`} numberOfLines={expanded ? undefined : 3}>
                        {campaignDetails.content}
                    </Text>
                    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                        <Text style={tw`text-[#B71515] font-bold`}>
                            {expanded ? "Voir moins" : "Voir plus"}
                        </Text>
                    </TouchableOpacity>
                    <View style={tw`mt-6 bg-[#FFE2E2] rounded-lg p-4`}>
                        <Text style={tw`text-[#3C0B0B] font-bold mb-2`}>Progression de la campagne</Text>
                        <View style={tw`bg-white rounded-full h-4 overflow-hidden`}>
                            <Animated.View style={[tw`bg-[#B71515] h-full`, { width: `${progress}%` }]} />
                        </View>
                        <Text style={tw`text-[#3C0B0B] mt-2`}>
                            {campaignDetails.current} / {campaignDetails.goal} dons
                        </Text>
                    </View>
                    <View style={tw`flex-row justify-between mt-6`}>
                        <TouchableOpacity style={tw`bg-[#B71515] py-3 px-6 rounded-full flex-row items-center`}>
                            <FontAwesome5 name="hand-holding-heart" size={20} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white font-bold`}>Participer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`bg-[#FFE2E2] py-3 px-6 rounded-full flex-row items-center`}
                            onPress={() => setShareCount(shareCount + 1)}
                        >
                            <Ionicons name="share-social" size={20} color="#B71515" style={tw`mr-2`} />
                            <Text style={tw`text-[#B71515] font-bold`}>Partager ({shareCount})</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>
            <View
                style={tw`absolute top-20 left-5 z-20 items-center`}
            >
                <TouchableOpacity style={tw`rounded-full p-2`} onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#3C0B0B" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
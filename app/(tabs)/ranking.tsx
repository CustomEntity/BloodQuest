import React, { useState, useMemo } from 'react';
import { Dimensions, SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useSession } from "@/ctx";
import Svg, { Path } from "react-native-svg";
import Text from "@/components/primitives/Text";
import BackgroundForm from "@/components/BackgroundForm";
import { Image } from "expo-image";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FilterButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
        style={tw`rounded-full ${isSelected ? 'bg-[#3C0B0B]' : 'bg-[#ED4141]'} items-center px-4 py-2 mr-2`}
        onPress={onPress}
    >
        <Text style={tw`text-white text-lg`}>
            {title}
        </Text>
    </TouchableOpacity>
);

const RankingItem = ({ rank, name, points, image, isCurrentUser }) => (
    <View style={tw`flex-row items-center justify-between py-2 ${isCurrentUser ? 'bg-[#3C0B0B]' : 'bg-[#ED4141]'} px-4 rounded-[12px] mb-2`}>
        <View style={tw`flex-row items-center`}>
            <Text style={tw`text-white text-lg w-8`}>{rank}</Text>
            <Image source={image} style={tw`w-10 h-10 rounded-full mr-2`} contentFit="cover" />
            <Text style={tw`text-white text-lg`}>{name}</Text>
        </View>
        <View style={tw`flex-row items-center gap-2`}>
            <Image source={require('../../assets/images/level.png')} style={tw`w-8 h-8`} contentFit="contain" />
            <Text style={tw`text-white text-lg`}>{points}</Text>
        </View>
    </View>
);

const generateRankingData = (count, currentRank) => {
    const names = [
        "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
        "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
        "Lucas", "Harper", "Henry", "Evelyn", "Alexander", "Abigail", "Michael",
        "Emily", "Daniel", "Elizabeth", "Jacob", "Sofia", "Logan", "Avery", "Jackson"
    ];

    return Array.from({ length: count }, (_, i) => ({
        rank: i + 1,
        name: i + 1 === currentRank ? "Vous" : names[i],
        points: Math.floor(Math.random() * 30) + 1, // Points between 1 and 30
        image: require('../../assets/images/character.png'),
        isCurrentUser: i + 1 === currentRank
    })).sort((a, b) => b.points - a.points)
        .map((item, index) => ({ ...item, rank: index + 1 }));
};

export default function Ranking() {
    const { signOut } = useSession();
    const [selectedFilter, setSelectedFilter] = useState('Don du sang');
    const filters = ['Don du sang', 'Don de plaquettes', 'Don de plasma'];

    const svgHeight = screenHeight * 0.46;

    const currentRanks = useMemo(() => ({
        'Don du sang': 7,
        'Don de plaquettes': 15,
        'Don de plasma': 3
    }), []);

    // Use useMemo to prevent re-generation of ranking data on each render
    const rankingData = useMemo(() => ({
        'Don du sang': generateRankingData(20, currentRanks['Don du sang']),
        'Don de plaquettes': generateRankingData(20, currentRanks['Don de plaquettes']),
        'Don de plasma': generateRankingData(20, currentRanks['Don de plasma'])
    }), [currentRanks]);

    const userRank = useMemo(() => {
        return rankingData[selectedFilter].find(item => item.isCurrentUser)?.rank || 0;
    }, [rankingData, selectedFilter]);

    return (
        <>
            <SafeAreaView style={tw`flex-1 bg-[#FFE2E2]`}>
                <View style={tw`items-center pt-4`}>
                    <Image
                        source={require('../../assets/images/character.png')}
                        style={tw`w-[60px] h-[77px]`}
                        contentFit='contain'
                    />
                    <Text style={tw`text-3xl font-bold text-center text-[#3C0B0B]`}>
                        Classement
                    </Text>
                </View>
                <View style={tw`items-center mt-2`}>
                    <Text style={[tw`text-[8] font-bold text-center text-[#3C0B0B]`, {
                        fontFamily: 'DelaGothicOne'
                    }]}>
                        Maître
                    </Text>
                    <Text style={[tw`text-[8] font-bold text-center text-[#3C0B0B]`, {
                        fontFamily: 'DelaGothicOne'
                    }]}>
                        des Plaquettes
                    </Text>
                </View>
                <View style={tw`gap-8 w-full items-center pt-8`}>
                    <View style={tw`rounded-full bg-[#B71515] items-center px-5 py-3`}>
                        <Text style={tw`text-white text-xl font-bold`}>
                            Votre classement : {userRank}ème
                        </Text>
                    </View>
                </View>
                <View style={tw`absolute left-0 bottom-0 w-full h-[48%] z-10`}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={tw`px-4 pb-4`}
                        style={tw`absolute top-4`}
                    >
                        {filters.map((filter) => (
                            <FilterButton
                                key={filter}
                                title={filter}
                                isSelected={filter === selectedFilter}
                                onPress={() => setSelectedFilter(filter)}
                            />
                        ))}
                    </ScrollView>
                    <ScrollView style={tw`mt-20 px-4`}>
                        {rankingData[selectedFilter].map((item) => (
                            <RankingItem key={item.rank} {...item} />
                        ))}
                    </ScrollView>
                </View>
                <View style={[tw`absolute bottom-0 left-0`, {width: screenWidth, height: svgHeight}]}>
                    <Svg
                        width={screenWidth}
                        height={svgHeight}
                        viewBox="0 0 390 260"
                        preserveAspectRatio="xMidYMax slice"
                    >
                        <Path
                            d="M0 130C0 58.203 87.254 0 195 0s195 58.203 195 130v130H0V130z"
                            fill="#B71515"
                        />
                    </Svg>
                </View>
            </SafeAreaView>
        </>
    );
}
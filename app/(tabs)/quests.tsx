import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import {Image} from "expo-image";
import {useFetchQuestsQuery} from "@/graphql/generated/graphql";

const QuestCard = ({title, description, progress, total, image}) => (
    <View style={tw`bg-[#B71515] rounded-[12px] p-4`}>
        <View style={tw`flex-row items-center gap-4`}>
            <Image
                source={image}
                style={tw`w-12 h-12`}
                contentFit='contain'
            />
            <View style={tw`flex-1`}>
                <Text style={tw`text-2xl font-bold text-white`}>
                    {title}
                </Text>
                <Text style={tw`text-base text-white`}>
                    {description}
                </Text>
            </View>
        </View>
        <View style={tw`mt-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-lg text-white`}>
                    Progression
                </Text>
                <Text style={tw`text-lg text-white`}>
                    {progress} / {total}
                </Text>
            </View>
            <View style={tw`w-full h-3 bg-white rounded-full overflow-hidden`}>
                <View
                    style={[
                        tw`h-full bg-[#ED4141]`,
                        {width: `${(progress / total) * 100}%`}
                    ]}
                />
            </View>
        </View>
    </View>
);

const Separator = () => (
    <View style={tw`w-[40%] h-7 self-center flex items-center justify-center pt-3`}>
        <View style={tw`w-full h-[5px] bg-[#B71515] opacity-70 rounded-full`}/>
    </View>
);

export default function Quests() {
    const quests = [
        {
            title: "Héros du sang",
            description: "Effectuer deux dons de sang total.",
            progress: 1,
            total: 2,
            image: require('../../assets/images/badge-1.png')
        },
        {
            title: "Gardiens de plasma",
            description: "Partager trois campagnes de don.",
            progress: 2,
            total: 3,
            image: require('../../assets/images/badge-2.png')
        },
        {
            title: "Champion de la vie",
            description: "Faire 2 dons de sang total en respectant l'intervalle minimum de 8 semaines.",
            progress: 1,
            total: 2,
            image: require('../../assets/images/badge-3.png')
        }
    ];

    const accomplishedQuests = [
        {
            title: "Héros du sang",
            description: "Effectuer deux dons de sang total.",
            progress: 2,
            total: 2,
            image: require('../../assets/images/badge-1.png')
        },
    ];

    return (
        <SafeAreaView style={tw`flex-1 bg-[#FFE2E2]`}>
            <View style={tw`flex-1`}>
                <View style={tw`items-center pt-4`}>
                    <Image
                        source={require('../../assets/images/character.png')}
                        style={tw`w-[60px] h-[77px]`}
                        contentFit='contain'
                    />
                    <Text style={tw`text-3xl font-bold text-center text-[#3C0B0B]`}>Quêtes</Text>
                </View>

                <View style={tw`px-4 mt-8`}>
                    <View style={tw`flex-row bg-[#ED4141] w-full justify-between rounded-[13px] px-8 py-4 gap-6`}>
                        <View style={tw`flex-col gap-4`}>
                            <Text style={[tw`text-2xl text-white`, {
                                fontFamily: 'DelaGothicOne'
                            }]}>
                                Stats
                            </Text>
                            <View style={tw`flex-col items-center gap-2`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    Dons effectués
                                </Text>
                                <View style={tw`flex-col items-center justify-center`}>
                                    <Image
                                        source={require('../../assets/images/drop.png')}
                                        style={tw`w-[64px] h-[64px]`}
                                        contentFit='contain'
                                    />
                                    <Text style={tw`absolute text-white text-2xl font-bold`}>
                                        2
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={tw`flex-col justify-center gap-2`}>
                            <View style={tw`flex-row items-center gap-2`}>
                                <View style={tw`w-9 h-9 bg-[#B02525] rounded-full items-center justify-center`}>
                                    <Text style={tw`text-white text-xl font-bold`}>4</Text>
                                </View>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    Accomplies
                                </Text>
                            </View>
                            <View style={tw`flex-row items-center gap-2`}>
                                <View style={tw`w-9 h-9 bg-[#B02525] rounded-full items-center justify-center`}>
                                    <Text style={tw`text-white text-xl font-bold`}>2</Text>
                                </View>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    En cours
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Separator/>

                <ScrollView contentContainerStyle={tw`px-4 pb-4`}>
                    <View style={tw`gap-4 mt-4`}>
                        <Text style={tw`text-[#3C0B0B] text-xl`}>
                            Quêtes en cours
                        </Text>
                        {quests.map((quest, index) => (
                            <QuestCard
                                key={index}
                                title={quest.title}
                                description={quest.description}
                                progress={quest.progress}
                                total={quest.total}
                                image={quest.image}
                            />
                        ))}
                    </View>
                    <View style={tw`gap-4 mt-8`}>
                        <Text style={tw`text-[#3C0B0B] text-xl`}>
                            Quêtes accomplies
                        </Text>
                        {accomplishedQuests.map((quest, index) => (
                            <QuestCard
                                key={index}
                                title={quest.title}
                                description={quest.description}
                                progress={quest.progress}
                                total={quest.total}
                                image={quest.image}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
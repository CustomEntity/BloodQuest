import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, ScrollView, View, FlatList, Dimensions, TouchableOpacity, Animated} from 'react-native';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import {Image, ImageBackground} from "expo-image";
import BackgroundForm from "@/components/BackgroundForm";
import {AntDesign} from "@expo/vector-icons";
import {useFetchMeQuery, useFetchUserAppointmentsQuery, User_Appointments} from "@/graphql/generated/graphql";
import {format, parseISO} from "date-fns";

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const CountdownItem = ({value, label}) => (
    <View style={tw`items-center`}>
        <Text style={tw`text-white text-3xl font-bold`}>{value}</Text>
        <Text style={tw`text-white text-xs`}>{label}</Text>
    </View>
);

const Separator = () => (
    <Text style={tw`text-white text-2xl font-bold self-start`}>:</Text>
);
const AppointmentCard = ({ appointment, index }: { appointment: User_Appointments, index: number }) => {
    const router = useRouter();

    const startTimeDate = parseISO(`${appointment.appointment?.date}T${appointment.appointment?.start_time}`);
    const endTimeDate = parseISO(`${appointment.appointment?.date}T${appointment.appointment?.end_time}`);

    return (
        <TouchableOpacity
            style={tw`bg-[#B71515] rounded-[33px] px-4 py-4 mr-4 w-[${SCREEN_WIDTH - 40}px] shadow-md`}
            onPress={() => router.push({
                pathname: `/appointment/${index}`,
                params: {
                    date: appointment.appointment?.date,
                    startTime: appointment.appointment?.start_time,
                    endTime: appointment.appointment?.end_time,
                    collection_point_name: appointment.appointment?.collection_point?.name,
                    collection_point_address: appointment.appointment?.collection_point?.address,
                    collection_point_full_address: appointment.appointment?.collection_point?.full_address,
                    collection_point_city: appointment.appointment?.collection_point?.city,
                    collection_point_postal_code: appointment.appointment?.collection_point?.postal_code,
                    collection_point_lat: appointment.appointment?.collection_point?.coordinates.coordinates[1],
                    collection_point_lng: appointment.appointment?.collection_point?.coordinates.coordinates[0],
                }
            })}
        >
            <View style={tw`flex-row items-center`}>
                <View style={tw`mr-4`}>
                    <Image
                        source={require('../../assets/images/hospital.png')}
                        style={tw`w-[82px] h-[84px]`}
                        contentFit='contain'
                    />
                </View>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-white text-xl font-bold flex-wrap`}>
                        {appointment.appointment?.collection_point?.name}
                    </Text>
                    <Text style={tw`text-[#FFE2E2] text-sm flex-wrap`}>
                        {appointment.appointment?.collection_point?.address}
                    </Text>
                </View>
            </View>
            <View style={tw`w-full h-[1px] bg-[#FFE2E2] my-4`}/>
            <View style={tw`flex-row justify-around items-center`}>
                <View style={tw`flex-row items-center gap-2`}>
                    <AntDesign name="calendar" size={24} color="#FFE2E2"/>
                    <Text style={tw`text-white text-sm`}>
                        {format(new Date(appointment.appointment?.date), 'EEEE, d MMMM', {locale: fr})}
                    </Text>
                </View>
                <View style={tw`flex-row items-center gap-2`}>
                    <AntDesign name="clockcircleo" size={24} color="#FFE2E2"/>
                    <Text style={tw`text-white text-sm`}>
                        {format(startTimeDate, 'HH:mm')} - {format(endTimeDate, 'HH:mm')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const AppointmentsList = ({ data, isLoading, isError, error }: { data: {
    user_appointments: User_Appointments[];
    }, isLoading: boolean, isError: boolean, error: any }) => {
    if (isLoading) {
        return <Text
            style={tw`ml-4`}>Loading...</Text>;
    }

    if (isError) {
        return <Text
            style={tw`ml-4 text-red-500`}
        >
            An error occurred, please try again later.
        </Text>;
    }

    if (data.user_appointments.length === 0) {
        return <Text
            style={tw`ml-4`}>
            Vous n'avez pas de rendez-vous prévus.
        </Text>;
    }

    return (
        <FlatList
            data={data.user_appointments}
            renderItem={({ item, index }) => <AppointmentCard appointment={item} index={index} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-4`}
        />
    );
}

import {useFocusEffect, useRouter} from 'expo-router';
import {fr} from "date-fns/locale";

const CampaignCard = ({ campaign, index }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={tw`bg-white rounded-[20px] mr-4 w-[${SCREEN_WIDTH * 0.7}px] overflow-hidden shadow-lg`}
            onPress={() => router.push(`/campaign/${index}`)}
        >
            <ImageBackground
                source={campaign.image}
                style={tw`w-full h-32`}
                imageStyle={tw`opacity-70`}
            >
                <View style={tw`flex-1 justify-end p-4 bg-black bg-opacity-30`}>
                    <Text style={tw`text-white text-xl font-bold`}>
                        {campaign.title}
                    </Text>
                </View>
            </ImageBackground>
            <View style={tw`w-full h-[1px] bg-white`}/>
            <View style={tw`p-4 bg-[#B71515]`}>
                <Text style={tw`text-white text-sm`} numberOfLines={3}>
                    {campaign.content}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const CampaignsList = ({ campaigns }) => {
    if (campaigns.length === 0) {
        return <Text
            style={tw`ml-4`}>No campaigns available.</Text>;
    }
    return (<FlatList
        data={campaigns}
        renderItem={({item}) => <CampaignCard campaign={item}/>}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
    />);
};

const CarouselSlider = ({items, onSelect}) => {
    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;
    const flatListRef = useRef();

    const onScroll = useRef((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        if (distance > 0.4) {
            setIndex(roundIndex);
        }
    }).current;

    useEffect(() => {
        onSelect(index);
    }, [index]);

    const Dot = ({index}) => {
        const isActive = indexRef.current === index;
        return (
            <View
                style={[
                    tw`h-3 w-3 rounded-full mx-1`,
                    isActive ? tw`bg-[#570404]` : tw`bg-[#ED4141]`
                ]}
            />
        );
    };

    return (
        <>
            <FlatList
                ref={flatListRef}
                data={items}
                renderItem={({item}) => (
                    <View style={{width: SCREEN_WIDTH}}>
                        <View style={tw`flex-row bg-[#B71515] mx-4 justify-between rounded-[33px] px-8 py-4 h-38`}>
                            <View style={tw`flex-1 justify-between mb-2`}>
                                <Text style={tw`text-white text-xl font-bold mb-2`}>
                                    Prochain don de {item.name}
                                </Text>
                                <View style={tw`flex-row justify-between items-end`}>
                                    <CountdownItem value={item.timeLeft.days?.toString().padStart(2, '0')}
                                                   label="jours"/>
                                    <Separator/>
                                    <CountdownItem value={item.timeLeft.hours?.toString().padStart(2, '0')}
                                                   label="heures"/>
                                    <Separator/>
                                    <CountdownItem value={item.timeLeft.minutes?.toString().padStart(2, '0')}
                                                   label="minutes"/>
                                    <Separator/>
                                    <CountdownItem value={item.timeLeft.seconds?.toString().padStart(2, '0')}
                                                   label="secondes"/>
                                </View>
                            </View>
                            <View style={tw`justify-center ml-4`}>
                                <Image
                                    source={require('../../assets/images/clock.png')}
                                    style={tw`w-[82px] h-[84px]`}
                                    contentFit='contain'
                                />
                            </View>
                        </View>
                    </View>
                )}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
            />
            <View style={tw`flex-row justify-center mt-4`}>
                {items.map((_, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            setIndex(i);
                            flatListRef.current.scrollToIndex({index: i, animated: true});
                        }}
                    >
                        <Dot index={i}/>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

export default function Index() {
    const data = useFetchMeQuery();

    const [selectedDonationType, setSelectedDonationType] = useState(0);
    const [donationTypes, setDonationTypes] = useState([
        {name: 'Sang', targetDate: new Date('2024-10-31T23:59:59'), timeLeft: {}},
        {name: 'Plasma', targetDate: new Date('2024-11-15T23:59:59'), timeLeft: {}},
        {name: 'Plaquettes', targetDate: new Date('2024-12-01T23:59:59'), timeLeft: {}},
    ]);
    const {
        data: appointmentsData,
        isLoading: isLoadingAppointments,
        isError: isErrorAppointments,
        error: errorAppointments,
        refetch: refetchAppointments
    } = useFetchUserAppointmentsQuery();

    useFocusEffect(() => {
        refetchAppointments();
    });

    const appointments = [
        {
            centerName: "Centre de don de Béziers",
            address: "Centre hospitalier, Rue Dimitri Amilakvari",
            date: "Lundi, 14 Octobre",
            time: "11:00 - 12:00"
        },
        {
            centerName: "Centre de don de Montpellier",
            address: "CHU de Montpellier, Avenue Augustin Fliche",
            date: "Mercredi, 16 Octobre",
            time: "14:00 - 15:00"
        },
    ].map((appointment, index) => ({ ...appointment, id: index }));

    const campaigns = [
        {
            image: require('../../assets/images/campaign-1.png'),
            title: "Ensemble, battons des records",
            content: "En 2024, l’EFS vit au rythme du sport ! Clubs mythiques et fédérations sportives s’associent à ...",
        },
        {
            image: require('../../assets/images/campaign-2.png'),
            title: "Ensemble, battons des records",
            content: "La Fédération Française pour le Don de Sang Bénévole est le partenaire de collecte historique ...",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setDonationTypes(prevTypes =>
                prevTypes.map(type => {
                    const now = new Date().getTime();
                    const difference = type.targetDate.getTime() - now;

                    if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                        return {...type, timeLeft: {days, hours, minutes, seconds}};
                    }
                    return type;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (

        <SafeAreaView style={tw`flex-1 bg-[#FFE2E2]`}>
            <BackgroundForm withTop={false}/>
            <ScrollView contentContainerStyle={tw`flex-grow gap-8 pb-4`}>
                <View style={tw`items-center pt-4`}>
                    <Image
                        source={require('../../assets/images/character.png')}
                        style={tw`w-[60px] h-[77px]`}
                        contentFit='contain'
                    />
                    <Text style={tw`text-3xl font-bold text-center text-[#3C0B0B]`}>Bonjour, {data.data?.users_me?.first_name}</Text>
                </View>
                <View style={tw`items-center`}>
                    <CarouselSlider
                        items={donationTypes}
                        onSelect={setSelectedDonationType}
                    />
                </View>
                <View style={tw`gap-4`}>
                    <Text
                        style={tw`text-[#3C0B0B] text-xl ml-4`}>
                        Mes rendez-vous
                    </Text>
                    <AppointmentsList
                        data={appointmentsData}
                        isLoading={isLoadingAppointments}
                        isError={isErrorAppointments}
                        error={errorAppointments}
                    />
                </View>
                <View style={tw`ml-4 gap-4`}>
                    <Text
                        style={tw`text-[#3C0B0B] text-xl`}>
                        Campagnes en cours
                    </Text>
                    <CampaignsList campaigns={campaigns} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
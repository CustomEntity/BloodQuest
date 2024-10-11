// app/appointment-selection/[id].tsx

import React, {useState, useEffect} from 'react';
import {Dimensions, SafeAreaView, ScrollView, TouchableOpacity, View, ActivityIndicator, Modal} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {
    Create_User_Appointments_Input,
    CreateUserAppointmentMutation,
    useCreateUserAppointmentMutation,
    useFetchCollectionPointAppointmentsQuery,
    useFetchMeQuery, useUserAppointmentMutation
} from "@/graphql/generated/graphql";
import {addDays, format, isSameDay, parseISO, startOfDay} from 'date-fns';
import {fr} from 'date-fns/locale';
import ConfettiCannon from 'react-native-confetti-cannon';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function AppointmentSelection() {
    const {id} = useLocalSearchParams();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const createUserAppointmentMutation = useUserAppointmentMutation();
    const {data: profile} = useFetchMeQuery();

    const {data, isLoading, error} = useFetchCollectionPointAppointmentsQuery({
        collectionPoint: id,
    });

    useEffect(() => {
        if (data?.collection_point_appointments?.length > 0) {
            const firstAppointmentDate = parseISO(data.collection_point_appointments[0].date);
            setSelectedDate(startOfDay(firstAppointmentDate));
        }
    }, [data]);

    const renderDateSelector = () => {
        const dates = Array.from({length: 7}, (_, i) => addDays(new Date(), i));

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-6`}>
                {dates.map((date, index) => (
                    <TouchableOpacity
                        key={index}
                        style={tw`items-center mr-4 ${isSameDay(date, selectedDate) ? 'bg-[#C12631]' : 'bg-white'} p-2 rounded-lg`}
                        onPress={() => setSelectedDate(date)}
                    >
                        <Text style={tw`${isSameDay(date, selectedDate) ? 'text-white' : 'text-[#C12631]'} font-bold`}>
                            {format(date, 'EEE', {locale: fr})}
                        </Text>
                        <Text
                            style={tw`${isSameDay(date, selectedDate) ? 'text-white' : 'text-[#C12631]'} text-lg font-bold mt-1`}>
                            {format(date, 'd', {locale: fr})}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
    const handleAppointmentSelection = (appointment) => {
        setSelectedAppointment(appointment);
        setShowConfirmationModal(true);
    };

    const confirmAppointment = () => {
        setShowConfetti(true);
        createUserAppointmentMutation.mutate({
            data: {
                appointment: Number(selectedAppointment.id),
                user: profile?.users_me?.id
            } as Create_User_Appointments_Input
        }, {
            onError: (e) => {
                console.log('error zebi', e);
            },
            onSuccess: () => {
                console.log('success zebi');
            }
        });
        setTimeout(() => {
            setShowConfirmationModal(false);
            setShowConfetti(false);
            router.back();
        }, 2000);
    };

    const renderAppointments = () => {
        if (isLoading) return <ActivityIndicator size="large" color="#C12631"/>;
        if (error) return <Text style={tw`text-red-500`}>Erreur lors du chargement des rendez-vous</Text>;

        const appointments = data?.collection_point_appointments?.filter(app =>
            isSameDay(parseISO(app.date), selectedDate)
        );

        if (!appointments || appointments.length === 0) {
            return <Text style={tw`text-center mt-4`}>Aucun rendez-vous disponible pour cette date</Text>;
        }

        return appointments.map((app, index) => {
            const startTimeDate = parseISO(`${app.date}T${app.start_time}`);
            const endTimeDate = parseISO(`${app.date}T${app.end_time}`);

            return (
                <TouchableOpacity
                    key={index}
                    style={tw`bg-white p-4 rounded-lg mb-4 flex-row justify-between items-center`}
                    onPress={() => handleAppointmentSelection(app)}
                >
                    <View>
                        <Text
                            style={tw`font-bold text-lg`}>{format(startTimeDate, 'HH:mm')} - {format(endTimeDate, 'HH:mm')}</Text>
                        <Text style={tw`text-gray-600`}>{app.nature}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#C12631"/>
                </TouchableOpacity>
            );
        });
    };

    const renderConfirmationModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmationModal}
            onRequestClose={() => setShowConfirmationModal(false)}
        >
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                <View style={tw`bg-white rounded-3xl p-6 w-5/6 items-center`}>
                    <Text style={tw`text-3xl font-bold mb-4 text-center text-[#C12631]`}>
                        Confirmer le rendez-vous
                    </Text>
                    <Text style={tw`text-5xl mb-4`}>📅</Text>
                    {selectedAppointment && (
                        <Text style={tw`text-base mb-6 text-center`}>
                            Voulez-vous confirmer votre rendez-vous pour le don de sang
                            le {format(parseISO(selectedAppointment.date), 'd MMMM yyyy', {locale: fr})} entre {selectedAppointment.start_time} et {selectedAppointment.end_time} ?
                        </Text>
                    )}
                    <TouchableOpacity
                        style={tw`bg-[#C12631] py-3 px-6 rounded-full mb-2`}
                        onPress={confirmAppointment}
                    >
                        <Text style={tw`text-white font-bold text-lg`}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`py-3 px-6 rounded-full`}
                        onPress={() => setShowConfirmationModal(false)}
                    >
                        <Text style={tw`text-[#C12631] font-bold text-lg`}>Annuler</Text>
                    </TouchableOpacity>
                </View>
                {showConfetti && (
                    <ConfettiCannon
                        count={100}
                        origin={{x: SCREEN_WIDTH / 2, y: -10}}
                        fallSpeed={3000}
                        fadeOut={true}
                        autoStart={true}
                        colors={['#C12631']}
                    />
                )}
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-[#FFE2E2]`}>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView style={tw`flex-1 p-4`}>
                <TouchableOpacity style={tw`mb-4`} onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#3C0B0B"/>
                </TouchableOpacity>

                <Text style={tw`text-2xl font-bold text-[#3C0B0B] mb-2`}>
                    {data?.collection_point_appointments?.[0]?.collection_point?.name}
                </Text>
                <Text style={tw`text-[#3C0B0B] mb-6`}>
                    {data?.collection_point_appointments?.[0]?.collection_point?.address}
                </Text>

                {renderDateSelector()}

                <View style={tw`bg-white p-4 rounded-lg mb-6`}>
                    <Text style={tw`text-lg font-bold mb-2`}>Rendez-vous disponibles</Text>
                    {renderAppointments()}
                </View>
            </ScrollView>
            {renderConfirmationModal()}
        </SafeAreaView>
    );
}
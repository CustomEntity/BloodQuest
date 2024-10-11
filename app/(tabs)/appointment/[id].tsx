import React from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {format} from "date-fns";
import {fr} from "date-fns/locale";

export default function AppointmentDetails() {
    const appointment = useLocalSearchParams();
    const router = useRouter();

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`flex-1`}>
                <ScrollView style={tw`flex-1`}>
                    <View style={tw`bg-[#B71515] p-6 rounded-b-3xl`}>
                        <TouchableOpacity style={tw`mb-4`} onPress={() => router.back()}>
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={tw`text-3xl font-bold text-white mb-2`}>
                            {
                                appointment.collection_point_name
                            }
                        </Text>
                        <View style={tw`flex-row justify-between items-center mt-4`}>
                            <View style={tw`bg-white p-2 rounded-lg flex-row items-center`}>
                                <AntDesign name="calendar" size={20} color="#B71515" style={tw`mr-2`} />
                                <Text style={tw`text-[#B71515] font-bold`}>
                                    {format(new Date(appointment.date), 'EEEE, d MMMM', { locale: fr })}
                                </Text>
                            </View>
                            <View style={tw`bg-white p-2 rounded-lg flex-row items-center`}>
                                <AntDesign name="clockcircleo" size={20} color="#B71515" style={tw`mr-2`} />
                                <Text style={tw`text-[#B71515] font-bold`}>{
                                    appointment.startTime.slice(0, 5) + ' - ' + appointment.endTime.slice(0, 5)
                                }</Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`p-6`}>
                        <View style={tw`flex-row items-center mb-6`}>
                            <View style={tw`w-12 h-12 bg-[#FFE2E2] rounded-full items-center justify-center mr-4`}>
                                <Ionicons name="water" size={24} color="#B71515" />
                            </View>
                            <Text style={tw`text-2xl font-bold text-[#3C0B0B]`}>Don de Sang</Text>
                        </View>

                        <Text style={tw`text-xl font-bold text-[#3C0B0B] mb-4`}>Instructions</Text>
                        {[
                            "Apportez une pièce d'identité",
                            "Mangez bien avant le don",
                            "Buvez beaucoup d'eau",
                            "Reposez-vous bien la veille"
                        ].map((instruction, index) => (
                            <View key={index} style={tw`flex-row items-center mb-3`}>
                                <View style={tw`w-8 h-8 bg-[#FFE2E2] rounded-full items-center justify-center mr-3`}>
                                    <Text style={tw`text-[#B71515] font-bold`}>{index + 1}</Text>
                                </View>
                                <Text style={tw`text-[#3C0B0B] flex-1`}>{instruction}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={tw`h-40`} />
                </ScrollView>

                <View style={tw`absolute bottom-0 left-0 right-0 bg-[#FFE2E2] rounded-t-3xl shadow-lg`}>
                    <View style={tw`p-6 pb-12`}>
                        <Text style={tw`text-xl font-bold text-[#3C0B0B] mb-4`}>Localisation</Text>
                        <View style={tw`bg-white p-4 rounded-2xl shadow-md`}>
                            <Text style={tw`text-[#3C0B0B] mb-3`}>{appointment.collection_point_full_address}</Text>
                            <TouchableOpacity
                                style={tw`bg-[#B71515] py-3 px-4 rounded-full flex-row items-center justify-center`}
                                onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${appointment.collection_point_lat},${appointment.collection_point_lng}`)}
                            >
                                <MaterialIcons name="directions" size={20} color="white" style={tw`mr-2`} />
                                <Text style={tw`text-white font-bold`}>Obtenir l'itinéraire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
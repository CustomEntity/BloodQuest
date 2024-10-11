import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Dimensions, Linking, Modal, Pressable, SafeAreaView, TouchableOpacity, View} from 'react-native';
import Text from "@/components/primitives/Text";
import tw from 'twrnc';
import {Image} from "expo-image";
import Svg, {Path} from "react-native-svg";
import MapView, {Marker} from 'react-native-maps';
import BackgroundForm from "@/components/BackgroundForm";
import BottomSheet from '@gorhom/bottom-sheet';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import ConfettiCannon from 'react-native-confetti-cannon';
import {useFetchCollectionPointsQuery} from "@/graphql/generated/graphql";
import {useRouter} from "expo-router";

const {width, height} = Dimensions.get('window');

const CustomMarker = () => (
    <Svg height={30} width={30} viewBox="0 0 24 24">
        <Path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#C12631"
            stroke="#FFFFFF"
            strokeWidth="1"
        />
    </Svg>
);

const donationTypes = [
    {
        type: 'sang',
        emoji: '🩸',
        info: 'Le don de sang total est le don le plus courant. Il permet de prélever tous les composants du sang : globules rouges, plasma et plaquettes.'
    },
    {
        type: 'plasma',
        emoji: '💉',
        info: 'Le don de plasma permet de prélever uniquement le plasma, la partie liquide du sang. Il est utilisé pour traiter les grands brûlés et les hémophiles.'
    },
    {
        type: 'plaquettes',
        emoji: '🧬',
        info: 'Le don de plaquettes est utilisé pour les patients atteints de leucémie ou de cancers. Les plaquettes ont une durée de vie très courte (5 jours).'
    },
];

export default function Donate() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const bottomSheetRef = useRef(null);
    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing] = useState<CameraType>('back');
    const [showModal, setShowModal] = useState(false);
    const [donationType, setDonationType] = useState(donationTypes[0]);
    const router = useRouter();

    const collectionPoints = useFetchCollectionPointsQuery({
        limit: 1500
    });

    const markers = collectionPoints.data?.collections_points.map((point) => ({
        latitude: point.coordinates.coordinates[1],
        longitude: point.coordinates.coordinates[0],
        title: point.name,
        id: point.id,
    }));

    const snapPoints = useMemo(() => ['25%', '55%'], []);

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setSelectedMarker(null);
        }
    }, []);

    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        bottomSheetRef.current?.expand();
    };

    const handleBarCodeScanned = ({type, data}) => {
        const randomDonation = donationTypes[Math.floor(Math.random() * donationTypes.length)];
        setDonationType(randomDonation);
        setShowModal(true);
        setShowScanner(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!permission) {
        return <View/>;
    }

    if (!permission.granted) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-lg text-center mb-4`}>Nous avons besoin de votre permission pour utiliser la
                    caméra</Text>
                <TouchableOpacity style={tw`bg-[#C12631] py-3 px-6 rounded-full`} onPress={requestPermission}>
                    <Text style={tw`text-white font-bold`}>Autoriser l'accès</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-[#FFE2E2] gap-8`}>
            <BackgroundForm/>
            {showScanner ? (
                <CameraView
                    style={tw`flex-1`}
                    facing={facing}
                    onBarcodeScanned={handleBarCodeScanned}
                >
                    <View style={tw`flex-1 bg-transparent justify-end items-center pb-10`}>
                        <TouchableOpacity
                            style={tw`bg-white py-3 px-6 rounded-full`}
                            onPress={() => setShowScanner(false)}
                        >
                            <Text style={tw`text-[#C12631] font-bold text-lg`}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <>
                    <View style={tw`items-center pt-4`}>
                        <Image
                            source={require('../../assets/images/character.png')}
                            style={tw`w-[60px] h-[77px]`}
                            contentFit='contain'
                        />
                        <Text style={tw`text-3xl font-bold text-center text-[#3C0B0B]`}>Faire un don</Text>
                    </View>
                    <View style={tw`px-6 items-center gap-8`}>
                        <Text style={[tw`mt-8 text-white text-3xl`, {
                            fontFamily: 'DelaGothicOne'
                        }]}>
                            Où donner ?
                        </Text>
                        <View style={tw`h-[371px] w-full rounded-[25px] overflow-hidden`}>
                            <MapView
                                style={tw`w-full h-full`}
                                initialRegion={{
                                    latitude: 41.8566,
                                    longitude: 2.3522,
                                    latitudeDelta: 10,
                                    longitudeDelta: 10,
                                }}
                            >
                                {markers?.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={marker}
                                        title={marker.title}
                                        onPress={() => handleMarkerPress(marker)}
                                    >
                                        <CustomMarker/>
                                    </Marker>
                                ))}
                            </MapView>
                            <BottomSheet
                            ref={bottomSheetRef}
                            index={-1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}
                            enablePanDownToClose={true}
                        >
                            <View style={tw`flex-1 p-4`}>
                                {selectedMarker && (
                                    <>
                                        <View style={tw`flex-col items-start justify-between`}>
                                            <View style={tw`mr-2`}>
                                                <Text
                                                    style={tw`text-2xl font-bold mb-4`}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {selectedMarker.title}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={tw`text-base mb-2`}>
                                            Un centre de don de sang est disponible à {selectedMarker.title}.
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                router.push({
                                                    pathname: `/appointment-selection/${selectedMarker.id}`,
                                                });
                                            }}
                                            style={tw`py-3 rounded-full px-6 bg-[#C12631]`}>
                                            <Text style={tw`text-white text-center uppercase`}>
                                                Prendre rendez-vous
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </BottomSheet>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://dondesang.efs.sante.fr/quiz')}
                                style={tw`py-4 rounded-full px-6 bg-white mx-auto`}>
                                <Text style={tw`text-center text-black uppercase`}>Vérifier mon
                                    éligibilité</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={tw`absolute top-20 right-5`}>
                        <Pressable
                            style={tw`rounded-full p-2`}
                            onPress={() => setShowScanner(true)}
                        >
                            <MaterialCommunityIcons name={'qrcode-scan'} size={32} color={'black'}/>
                        </Pressable>
                    </View>
                </>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={closeModal}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <View style={tw`bg-white rounded-3xl p-6 w-5/6 items-center`}>
                        <Text style={tw`text-3xl font-bold mb-4 text-center text-[#C12631]`}>
                            Bravo pour ton don de {donationType.type} !
                        </Text>
                        <Text style={tw`text-5xl mb-4`}>{donationType.emoji.repeat(3)}</Text>
                        <Text style={tw`text-base mb-6 text-center`}>{donationType.info}</Text>
                        <TouchableOpacity
                            style={tw`bg-[#C12631] py-3 px-6 rounded-full`}
                            onPress={closeModal}
                        >
                            <Text style={tw`text-white font-bold text-lg`}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                    {showModal && (
                        <ConfettiCannon
                            count={100}
                            origin={{x: width / 2, y: -10}}
                            fallSpeed={3000}
                            fadeOut={true}
                            autoStart={true}
                            colors={['#C12631']}
                        />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}
import tw from "twrnc";
import Svg, {Ellipse, Path} from "react-native-svg";
import {Dimensions, View} from "react-native";
import React from "react";

const {width: screenWidth} = Dimensions.get('screen');

const BackgroundForm = ({withTop = true}) => {
    const originalWidth = 390;
    const originalHeight = 680;
    const scaledHeight = (screenWidth * originalHeight) / originalWidth;

    return (
        <View style={tw`absolute w-full bottom-[-25] left-0`}>
            <Svg
                width={screenWidth}
                height={scaledHeight}
                viewBox={`0 0 ${originalWidth} ${originalHeight}`}
                preserveAspectRatio="xMidYMid slice"
            >
                {withTop && (
                    <>
                        <Ellipse cx={199} cy={200.937} fill="#B71515" rx={256} ry={180.937}/>
                        <Path fill="#B71515" d="M0 241.938h390V701H0z"/>
                    </>
                )}
                <Path
                    fill="#ED4141"
                    fillRule="evenodd"
                    d="M144.972 554.465c96.2-5.615 190.623-91.448 270.344-50.376 77.829 40.097 42.394 133.899 28.405 204.29-11.473 57.73-38.169 114.961-99.002 150.943-55.293 32.705-130.163 18.649-199.747 25.764-90.586 9.262-211.287 78.815-262.261 21.476-54.6-61.419 99.1-124.334 105.172-198.183 5.228-63.576-125.966-124.554-74.486-174.994 49.362-48.364 150.99 25.784 231.575 21.08Z"
                    clipRule="evenodd"
                />
            </Svg>
        </View>
    )
}

export default BackgroundForm;
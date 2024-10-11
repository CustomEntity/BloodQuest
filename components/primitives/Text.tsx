import React from 'react';
import {StyleSheet, TextProps} from 'react-native';
import {Text as RNText} from 'react-native';

const Text: React.FC<TextProps> = ({children, style, ...props}) => {
    return (
        <RNText style={[styles.defaultText, style]} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: 'ADLaMDisplay',
    },
});

export default Text;
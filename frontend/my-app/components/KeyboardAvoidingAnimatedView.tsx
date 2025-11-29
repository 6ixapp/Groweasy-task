import React from 'react';
import { KeyboardAvoidingView, Platform, ViewProps } from 'react-native';

interface Props extends ViewProps {
    behavior?: 'padding' | 'height' | 'position';
}

const KeyboardAvoidingAnimatedView: React.FC<Props> = ({ children, style, behavior, ...props }) => {
    return (
        <KeyboardAvoidingView
            style={style}
            behavior={Platform.OS === 'ios' ? 'padding' : behavior}
            {...props}
        >
            {children}
        </KeyboardAvoidingView>
    );
};

export default KeyboardAvoidingAnimatedView;

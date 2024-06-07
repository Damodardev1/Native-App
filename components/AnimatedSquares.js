
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimatedSquares = () => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 10000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animation]);

    const squares = [
        {
            style: styles.square1,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: 10, translateY: -10 },
        },
        {
            style: styles.square2,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: -10, translateY: 10 },
        },
        {
            style: styles.square3,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: 10, translateY: 10 },
        },
        {
            style: styles.square4,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: -10, translateY: -10 },
        },
        {
            style: styles.square5,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: 10, translateY: 10 },
        },
        {
            style: styles.square6,
            initialTransform: { translateX: 0, translateY: 0 },
            finalTransform: { translateX: -10, translateY: -10 },
        },
    ];

    return (
        <View style={styles.container}>
            {squares.map((square, index) => {
                const translateX = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [square.initialTransform.translateX, square.finalTransform.translateX],
                });
                const translateY = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [square.initialTransform.translateY, square.finalTransform.translateY],
                });
                return (
                    <Animated.View
                        key={index}
                        style={[
                            square.style,
                            {
                                transform: [{ translateX }, { translateY }],
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    square1: {
        width: 100,
        height: 100,
        top: 75,
        right: -25,
        backgroundColor: '#bff7fb',
        position: 'absolute',
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    square2: {
        width: 150,
        height: 150,
        // top: 105,
        top:'40%',
        left: 325,
        backgroundColor: '#ebbffeaa',
        position: 'absolute',
        zIndex: 2,
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    square3: {
        width: 60,
        height: 60,
        bottom: 105,
        right: 45,
        backgroundColor: '#ccfb92a7',
        position: 'absolute',
        zIndex: 2,
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    square4: {
        width: 50,
        height: 50,
        bottom: 135,
        left: 25,
        backgroundColor: '#ff828298',
        position: 'absolute',
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    square5: {
        width: 50,
        height: 50,
        top: 150,
        left: -25,
        backgroundColor: '#93a3ffc4',
        position: 'absolute',
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    square6: {
        width: 85,
        height: 85,
        top: 295,
        right: 295,
        backgroundColor: '#feddf6',
        position: 'absolute',
        zIndex: 2,
        borderRadius: 15,
        opacity: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
});

export default AnimatedSquares;
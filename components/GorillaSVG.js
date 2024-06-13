import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, { Easing, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path, G, Defs, ClipPath, Use, Polygon, Rect, Ellipse } from 'react-native-svg';
const GorillaSVG = ({ isEyesClosed, showHands, faceRotation }) => {
  const eyeLX = useSharedValue(0);
  const eyeLY = useSharedValue(0);
  const eyeRX = useSharedValue(0);
  const eyeRY = useSharedValue(0);
  const mouthX = useSharedValue(0);
  const mouthY = useSharedValue(0);
  const mouthScale = useSharedValue(1);
  const armsY = useSharedValue(0);
  const armsRotation = useSharedValue(105);

  useEffect(() => {
    eyeLX.value = withTiming(isEyesClosed ? -10 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    eyeLY.value = withTiming(isEyesClosed ? -10 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    eyeRX.value = withTiming(isEyesClosed ? -10 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    eyeRY.value = withTiming(isEyesClosed ? -10 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isEyesClosed]);

  useEffect(() => {
    armsY.value = withTiming(showHands ? 0 : 220, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
    armsRotation.value = withTiming(showHands ? 0 : 105, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [showHands]);

  const animatedEyeLProps = useAnimatedProps(() => ({
    transform: `translate(${eyeLX.value}, ${eyeLY.value})`,
  }));

  const animatedEyeRProps = useAnimatedProps(() => ({
    transform: `translate(${eyeRX.value}, ${eyeRY.value})`,
  }));

  const animatedMouthProps = useAnimatedProps(() => ({
    transform: `translate(${mouthX.value}, ${mouthY.value}) scale(${mouthScale.value})`,
  }));

  const animatedArmsProps = useAnimatedProps(() => ({
    transform: `translateY(${armsY.value}) rotate(${armsRotation.value}deg)`,
  }));

  return (
    <View style={styles.svgContainer}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        style={[styles.mySVG, { transform: [{ rotate: `${faceRotation}deg` }] }]}
      >
        <Defs>
          <Circle id="armMaskPath" cx="100" cy="100" r="100" />
        </Defs>
        <ClipPath id="armMask">
          <Use href="#armMaskPath" overflow="visible" />
        </ClipPath>
        <Circle cx="100" cy="100" r="100" fill="#a9ddf3" />
        <G className="body">
          <Path
            className="bodyBGnormal"
            stroke="#3A5E77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#FFFFFF"
            d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
          />
          <Path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
        </G>
        <G className="earL">
          <G className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
            <Circle cx="47" cy="83" r="11.5" />
            <Path
              d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <G className="earHair">
            <Rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
            <Path
              d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
              fill="#fff"
              stroke="#3a5e77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </G>
        <G className="earR">
          <G className="outerEar">
            <Circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
            <Path
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M153.7,78.9c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
            />
          </G>
          <G className="earHair">
            <Rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
            <Path
              fill="#FFFFFF"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M146.6,62.8c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5c-1.2-0.7-3.4-1.4-5.2-1.9"
            />
          </G>
        </G>
        <Path
          className="chin"
          d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
          fill="none"
          stroke="#3a5e77"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
        <Path
          className="hair"
          fill="#FFFFFF"
          stroke="#3A5E77"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M81.457,27.929c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
        />
        <G className="eyebrow">
          <Path
            fill="#FFFFFF"
            d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
          />
          <Path
            fill="#FFFFFF"
            stroke="#3A5E77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M63.56,55.102c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037c4.913-0.481,9.857-1.34,14.787-2.599"
          />
        </G>
        <G className="eyeL">
          <Animated.Circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" animatedProps={animatedEyeLProps} />
          <Circle cx="84" cy="76" r="1" fill="#fff" />
        </G>
        <G className="eyeR">
          <Animated.Circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" animatedProps={animatedEyeRProps} />
          <Circle cx="113" cy="76" r="1" fill="#fff" />
        </G>
        <G className="mouth">
          <Animated.Path
            className="mouthBG"
            fill="#617E92"
            d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
            animatedProps={animatedMouthProps}
          />
          <Path
            style={{ display: 'none' }}
            className="mouthSmallBG"
            fill="#617E92"
            d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
          />
          <Path
            style={{ display: 'none' }}
            className="mouthMediumBG"
            d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2c0,4.5-3.7,8.2-8.2,8.2H95z"
          />
          <Path
            style={{ display: 'none' }}
            className="mouthLargeBG"
            d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
            fill="#617e92"
            stroke="#3a5e77"
            strokeLinejoin="round"
          />
        </G>
        <Path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
        <G className="arms" clipPath="url(#armMask)">
          <G className="armL" animatedProps={animatedArmsProps} style={{ display: showHands ? 'block' : 'none' }}>
            <Polygon
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"
            />
            <Path
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"
            />
            <Path
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"
            />
            <G className="twoFingers">
              <Path
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"
              />
              <Path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z" />
              <Path
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"
              />
              <Path fill="#A9DDF3" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z" />
            </G>
            <Path fill="#A9DDF3" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z" />
            <Path fill="#A9DDF3" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z" />
          </G>
          <G className="armR" animatedProps={animatedArmsProps} style={{ display: showHands ? 'block' : 'none' }}>
            <Polygon
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              points="78.7,98.4 89,59.7 50.2,49.3 30.2,85.4"
            />
            <Path
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M65.6,53.5L46.3,48.3c-2.7-0.7-5.4,0.9-6.1,3.5v0c-0.7,2.7,0.9,5.4,3.5,6.1l10.3,2.8"
            />
            <Path
              fill="#DDF1FA"
              stroke="#3A5E77"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M49.1,59.4l-26-7c-2.7-0.7-5.4,0.9-6.1,3.5v0c-0.7,2.7,0.9,5.4,3.5,6.1l21.3,5.7"
            />
            <G className="twoFingers">
              <Path
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M41.7,67.8L18.6,61.6c-2.7-0.7-5.4,0.9-6.1,3.5v0c-0.7,2.7,0.9,5.4,3.5,6.1l23.1,6.2"
              />
              <Path fill="#A9DDF3" d="M19.9,65l-2.2-0.6c-1.1-0.3-2.2,0.3-2.4,1.4v0c-0.3,1.1,0.3,2.2,1.4,2.4l2.2,0.6L19.9,65z" />
              <Path
                fill="#DDF1FA"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M39.2,77.5l-19.4-5.2c-2.7-0.7-5.4,0.9-6.1,3.5v0c-0.7,2.7,0.9,5.4,3.5,6.1l18.3,4.9"
              />
              <Path fill="#A9DDF3" d="M21.2,75.7l-2.2-0.6c-1.1-0.3-2.2,0.3-2.4,1.4v0c-0.3,1.1,0.3,2.2,1.4,2.4l2.2,0.6L21.2,75.7z" />
            </G>
            <Path fill="#A9DDF3" d="M24.5,55.9l-2.2-0.6c-1.1-0.3-2.2,0.3-2.4,1.4v0c-0.3,1.1,0.3,2.2,1.4,2.4l2.2,0.6L24.5,55.9z" />
            <Path fill="#A9DDF3" d="M47.9,50.4l-2.2-0.6c-1.1-0.3-2.2,0.3-2.4,1.4v0c-0.3,1.1,0.3,2.2,1.4,2.4l2.2,0.6L47.9,50.4z" />
          </G>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F2F3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  svgContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    marginBottom: -55,
    borderRadius: 80,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mySVG: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fieldGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f00c34',
    height: 65,
    paddingHorizontal: 10,
    width: 300,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#545a6d',
    textAlign: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#000',
    marginRight: 10,
  },
  eyeIcon: {
    fontSize: 20,
    color: 'rgb(172, 224, 244)',
  },
  button: {
    backgroundColor: 'deeppink',
    borderRadius: 30,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default GorillaSVG;

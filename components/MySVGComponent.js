import React from 'react';
import Svg, { Circle, Path, G, ClipPath, Defs, Use, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const MySVGComponent = ({ isPasswordFocused }) => {
  const armLeftX = useSharedValue(-93);
  const armLeftY = useSharedValue(220);
  const armRightX = useSharedValue(-93);
  const armRightY = useSharedValue(220);

  if (isPasswordFocused) {
    armLeftX.value = withTiming(-93, { duration: 450 });
    armLeftY.value = withTiming(2, { duration: 450 });
    armRightX.value = withTiming(-93, { duration: 450 });
    armRightY.value = withTiming(2, { duration: 450 });
  } else {
    armLeftX.value = withTiming(-93, { duration: 1350 });
    armLeftY.value = withTiming(220, { duration: 1350 });
    armRightX.value = withTiming(-93, { duration: 1350 });
    armRightY.value = withTiming(220, { duration: 1350 });
  }

  const armLeftProps = useAnimatedProps(() => ({
    transform: `translate(${armLeftX.value}, ${armLeftY.value})`,
  }));

  const armRightProps = useAnimatedProps(() => ({
    transform: `translate(${armRightX.value}, ${armRightY.value})`,
  }));

  return (
    <Svg height="200" width="200" viewBox="0 0 200 200">
      <Defs>
        <Circle id="armMaskPath" cx={100} cy={100} r={100} />
      </Defs>
      <ClipPath id="armMask">
        <Use href="#armMaskPath" overflow="visible" />
      </ClipPath>
      <Circle cx={100} cy={100} r={100} fill="#a9ddf3" />
      <G className="body">
        <Path
          fill="#FFFFFF"
          d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1
          c-10.6,0-20,5.1-25.8,13l0,78h187L193.3,135.9z"
        />
        <Path
          fill="none"
          stroke="#3A5E77"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M193.3,135.9
          c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13"
        />
        <Path
          fill="#DDF1FA"
          d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9
          C143,167.5,122.9,156.4,100,156.4z"
        />
      </G>
      <G className="earL">
        <G
          className="outerEar"
          fill="#ddf1fa"
          stroke="#3a5e77"
          strokeWidth="2.5"
        >
          <Circle cx={47} cy={83} r="11.5" />
          <Path
            d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <G className="earHair">
          <Rect x={51} y={64} fill="#FFFFFF" width={15} height={35} />
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
        <G
          className="outerEar"
          fill="#ddf1fa"
          stroke="#3a5e77"
          strokeWidth="2.5"
        >
          <Circle cx={155} cy={83} r="11.5" />
          <Path
            d="M155.7 78.9c2.3 0 4.1 1.9 4.1 4.1 0 2.3-1.9 4.1-4.1 4.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <G className="earHair">
          <Rect x={131} y={64} fill="#FFFFFF" width={20} height={35} />
          <Path
            d="M148.6 62.8c4.9 4.6 8.4 9.4 10.6 14.2-3.4-.1-6.8-.1-10.1.1 4 3.7 6.8 7.6 8.2 11.6-2.1 0-4.2 0-6.3.2 2.6 4.1 3.8 8.3 3.7 12.5-1.2-.7-3.4-1.4-5.2-1.9"
            fill="#fff"
            stroke="#3a5e77"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
      <Path
        className="face"
        fill="#DDF1FA"
        d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
      />
      <Path
        className="hair"
        fill="#FFFFFF"
        stroke="#3A5E77"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M81.457,27.929
          c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235
          c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,13.034-4.232,17.926-4.232c-4.017,3.19-7.192,6.687-9.482,10.291"
      />
      <Path
        className="hair"
        fill="#FFFFFF"
        stroke="#3A5E77"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M136.59,29.793
          c-1.668-1.488-4.008-1.69-6.016-1.043c-0.563,0.176-1.104,0.419-1.629,0.715c-2.052-3.568-5.425-5.896-9.047-5.896
          c-3.168,0-6.071,1.835-8.142,4.861c-0.002-0.002-0.004-0.004-0.006-0.006c0.943-3.293,1.33-6.689,1.306-10.055
          c-1.646,3.666-5.168,6.326-10.012,7.75c-1.812,0.536-3.322,1.401-4.581,2.464c-1.349-2.952-2.832-5.924-4.442-8.881
          c-0.362,3.294-1.009,6.612-1.916,9.931c-0.857,3.144-2.012,6.279-3.442,9.373c-2.193,4.626-5.064,9.037-8.564,12.949
          c-2.646,2.97-5.49,5.703-8.504,8.123"
      />
      <Path
        className="hair"
        fill="#FFFFFF"
        stroke="#3A5E77"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M137.37,44.83
          c-1.451-1.187-3.546-1.552-5.803-1.063c-1.39,0.285-2.793,0.774-4.195,1.38c-0.066-0.427-0.143-0.854-0.232-1.28
          c-0.67-3.155-1.69-6.254-2.938-9.146c0.113,2.604,0.019,5.217-0.279,7.806c-0.254,2.286-0.658,4.548-1.189,6.779
          c-0.697-0.01-1.396,0.041-2.096,0.15c-3.339,0.521-6.4,1.911-8.967,3.788c-1.042,0.76-1.997,1.605-2.846,2.511
          c-1.333,0.854-2.556,1.889-3.654,3.068c-2.184,2.312-3.817,5.115-4.711,8.253c-0.893,3.137-1.109,6.591-0.59,10.094
          c-1.142-1.975-2.506-3.807-4.01-5.461c-2.437-2.747-5.245-5.094-8.263-6.802"
      />
      <G className="eyebrow">
        <Path
          fill="#FFFFFF"
          stroke="#3A5E77"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M82.708,73.131
            c4.051-2.345,8.494-3.632,13.07-4.089"
        />
        <Path
          fill="#FFFFFF"
          stroke="#3A5E77"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M118.808,69.194
            c4.518,0.378,8.888,1.555,13.013,3.448"
        />
      </G>
      <G className="eyeWrap">
        <Path
          fill="#FFFFFF"
          d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-1.276-3.622-3.369-6.856-6.206-9.462
          C124.008,48.369,130.562,51.214,138.142,55.064z"
        />
        <Path
          fill="#FFFFFF"
          d="M61.954,55.064c4.93,1.259,9.874,2.118,14.787,2.599c1.276-3.622,3.369-6.856,6.206-9.462
          C75.992,48.369,69.439,51.214,61.954,55.064z"
        />
      </G>
      <Path
        className="eyeL"
        fill="#3A5E77"
        d="M103.27,69.51c-1.326-2.028-3.94-3.379-6.77-3.379-2.82,0-5.433,1.342-6.762,3.354-.116,.121-.226,.248-.321,.383
          -.68,.986-1.092,2.146-1.092,3.387 0,3.327,2.686,6.026,5.995,6.026,3.307,0,5.993-2.699,5.993-6.026
          C104.31,71.668,103.89,70.496,103.27,69.51z"
      />
      <Path
        className="eyeR"
        fill="#3A5E77"
        d="M139.072,69.51c-1.327-2.028-3.941-3.379-6.771-3.379-2.821,0-5.433,1.342-6.762,3.354-.116,.121-.226,.248-.321,.383
          -.68,.986-1.092,2.146-1.092,3.387 0,3.327,2.686,6.026,5.995,6.026,3.307,0,5.993-2.699,5.993-6.026
          C140.109,71.668,139.688,70.496,139.072,69.51z"
      />
      <Path
        className="mouth"
        fill="#617E92"
        d="M119.5,98.749c-2.386,2.309-5.691,3.621-9.501,3.621s-7.115-1.312-9.501-3.621"
      />
      <Path
        className="nose"
        fill="#FFFFFF"
        stroke="#3A5E77"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M115,85.331c-2.756,0-5.131-.483-6.839-1.22"
      />
      <AnimatedPath animatedProps={armLeftProps} />
      <AnimatedPath animatedProps={armRightProps} />
    </Svg>
  );
};

export default MySVGComponent;

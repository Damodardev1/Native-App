import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ladder from '../assets/images/ladder.png';
import lights from '../assets/images/lights.png';
import trolley from '../assets/images/Trolley.png';

const images = [
  ladder,
  lights,
  trolley,
];

const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={images[currentImageIndex]} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default ImageCarousel;

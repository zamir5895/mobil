import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface MultimediaInicioDTO {
  id: string;
  contenidoUrl: string;
  tipo: string;
  fechaCreacion: string;
}

interface CarouselProps {
  multimedia: MultimediaInicioDTO[];
  style?: object;  // Para estilos adicionales
}

const Carousel: React.FC<CarouselProps> = ({ multimedia, style }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % multimedia.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + multimedia.length) % multimedia.length
    );
  };

  return (
    <View style={[styles.carouselContainer, style]}>
      <Image
        source={{ uri: multimedia[currentIndex]?.contenidoUrl || '' }}
        style={styles.image}
        resizeMode="contain"
      />
      {multimedia.length > 1 && (
        <>
          <TouchableOpacity onPress={prevImage} style={styles.navButtonLeft}>
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextImage} style={styles.navButtonRight}>
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250, // Puedes ajustar la altura según el diseño
  },
  navButtonLeft: {
    position: 'absolute',
    top: '50%',
    left: 10,
    transform: [{ translateY: '-50%' }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  navButtonRight: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{ translateY: '-50%' }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  navButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default Carousel;

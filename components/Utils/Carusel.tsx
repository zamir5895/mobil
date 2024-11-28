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
  style?: object;
}

const Carousel: React.FC<CarouselProps> = ({ multimedia, style }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (multimedia.length === 0) {
    return (
      <View style={[styles.carouselContainer, style]}>
        <Text>No hay contenido multimedia disponible</Text>
      </View>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % multimedia.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + multimedia.length) % multimedia.length);
  };

  return (
    <View style={[styles.carouselContainer, style]}>
      <Image
        source={{ uri: multimedia[currentIndex].contenidoUrl }}
        style={styles.image}
      />
      <View style={styles.navigation}>
        <TouchableOpacity onPress={prevImage} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextImage} style={styles.navButton}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  navigation: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: '50%',
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  navButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Carousel;
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { obtenerPequeñaInfo } from "@/Services/User/UserService";
import { Ionicons } from '@expo/vector-icons'; // Usando expo-vector-icons
import { crearPublicacionInicio, subirArchivos } from "@/Services/Publicaciones/Publicaciones";

interface CrearPublicacionProps {
  showNewPost: boolean;
  newPostContent: string;
  setNewPostContent: React.Dispatch<React.SetStateAction<string>>;
  onPostCreated: (newPost: {
    id: number;
    contenido: string;
    autorId: number;
    autorNombre: string;
    autorFotoUrl: string;
    fechaPublicacion: string;
    cantidadComentarios: number;
    cantidadLikes: number;
    multimedia: MultimediaInicioDTO[];
  }) => void;
}

interface PostInicioDTO {
  cuerpo: string;
  autorPId: number;
}

interface MultimediaInicioDTO {
  id: string;
  contenidoUrl: string;
  tipo: string;
  fechaCreacion: string;
}

const CrearPublicacion: React.FC<CrearPublicacionProps> = ({
  showNewPost,
  newPostContent,
  setNewPostContent,
  onPostCreated,
}) => {
  if (!showNewPost) return null;

  const [files, setFiles] = useState<any[]>([]); // Para manejar las imágenes seleccionadas
  const [isPublishing, setIsPublishing] = useState(false);
  const [user, setUser] = useState<any>({});
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setStoredUserId(userId);
    };
    fetchUserId();
  }, []);

  const userId = parseInt(storedUserId || '');

  useEffect(() => {
    const fetchObtenerPequeñaInfoUsuario = async () => {
      try {
        const response = await obtenerPequeñaInfo(userId);
        setUser(response);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };

    if (userId) {
      fetchObtenerPequeñaInfoUsuario();
    }
  }, [userId]);

  const handleFileSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería de imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsMultipleSelection: true, 
      quality: 1,
    });

    if (!result.canceled) {
      setFiles((prevFiles) => [...prevFiles, ...result.assets]); 
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!newPostContent.trim() && files.length === 0) return;
  
    setIsPublishing(true);
  
    try {
      const postInicioDTO: PostInicioDTO = { cuerpo: newPostContent, autorPId: user?.userId || 0 };
      const post = await crearPublicacionInicio(postInicioDTO);
  
      let multimedia: MultimediaInicioDTO[] = [];
      if (files.length > 0) {
        console.log("Archivos a subir:", files);
        const response = await subirArchivos(post.id, files); // Enviar archivos
        if (response && response.multimediaInicioDTO) {
          multimedia = response.multimediaInicioDTO.map((file: any) => ({
            id: file.id,
            contenidoUrl: file.contenidoUrl,
            tipo: file.tipo,
            fechaCreacion: file.fechaCreacion,
          }));
        }
      }
  
      const newPost = {
        id: post.id,
        contenido: postInicioDTO.cuerpo,
        autorId: user?.userId || 0,
        autorNombre: user?.fullName || "Usuario",
        autorFotoUrl: user?.fotoPerfil || "/default-profile.png",
        fechaPublicacion: new Date(post.fechaPublicacion).toLocaleDateString(),
        cantidadComentarios: 0,
        cantidadLikes: 0,
        multimedia,
      };
  
      setNewPostContent("");
      setFiles([]);
      onPostCreated(newPost);
    } catch (error) {
      console.error("Error durante la publicación:", error);
    } finally {
      setIsPublishing(false);
    }
  };
  
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Crear Publicación</Text>
      <View style={styles.cardContent}>
        <View style={styles.inputContainer}>
          <Image
            source={{ uri: user?.fotoPerfil || "/default-profile.png" }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.textarea}
            placeholder="¿Qué estás pensando?"
            value={newPostContent}
            onChangeText={(text) => setNewPostContent(text)}
            multiline
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleFileSelect} style={styles.button}>
            <Ionicons name="image-outline" style={styles.icon} />
            <Text>Foto/Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="happy-outline" style={styles.icon} />
            <Text>Sentimiento</Text>
          </TouchableOpacity>
        </View>

        {files.length > 0 && (
          <FlatList
            data={files}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.fileItem}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 50, height: 50, borderRadius: 5 }}
                />
                <TouchableOpacity onPress={() => removeFile(index)} style={styles.removeButton}>
                  <Ionicons name="close-circle" style={styles.icon} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.cardFooter}>
        <Button
          onPress={handlePublish}
          title={isPublishing ? "Publicando..." : "Publicar"}
          disabled={isPublishing || (!newPostContent.trim() && files.length === 0)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContent: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textarea: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  removeButton: {
    padding: 5,
  },
  cardFooter: {
    alignItems: "center",
  },
});

export default CrearPublicacion;

"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CharacterForm from "@/components/shared/CharacterForm";
import { useRouter } from "next/navigation";

export default function CreateCharacter() {

  const router = useRouter();

  const handleCharacterSubmit = async (character: {
    nom: string;
    image: string | ArrayBuffer | null;
    force: number;
    vitesse: number;
    endurance: number;
    power: number;
    combat: number;
  }) => {
    try {
      // Créer un objet FormData pour gérer le fichier
      const formData = new FormData();

      // Ajouter les propriétés du personnage
      formData.append('name', character.nom);
      formData.append('strength', character.force.toString());
      formData.append('speed', character.vitesse.toString());
      formData.append('durability', character.endurance.toString());
      formData.append('power', character.power.toString());
      formData.append('combat', character.combat.toString());
      
      // Ajouter l'image si elle existe
      if (character.image) {
        // Si l'image est une chaîne base64, convertir en Blob
        if (typeof character.image === 'string') {
          // Extraire les données base64 (supprimer "data:image/xxx;base64,")
          const base64Response = await fetch(character.image);
          const blob = await base64Response.blob();
          formData.append('image', blob, 'character_image.png');
        } 
        // Si c'est un ArrayBuffer
        else if (character.image instanceof ArrayBuffer) {
          const blob = new Blob([character.image]);
          formData.append('image', blob, 'character_image.png');
        }
      }

      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://127.0.0.1:8000/api/characters/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas ajouter 'Content-Type' - FormData le définit automatiquement
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Redirection vers la page des personnages
      router.push('/personnages');
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Créer votre combattant
        </motion.h1>

        {/* Formulaire de création de personnage */}
        <CharacterForm onSubmit={handleCharacterSubmit} />
      </main>
    </div>
  );
}

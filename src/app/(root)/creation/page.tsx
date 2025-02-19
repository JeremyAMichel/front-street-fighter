"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CharacterForm from "@/components/shared/CharacterForm";

export default function CreateCharacter() {
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
      // Transformation des données pour l'envoi
      const formattedCharacter = {
        name: character.nom,
        // TODO : image
        strength: character.force,
        speed: character.vitesse,
        durability: character.endurance,
        power: character.power,
        combat: character.combat
      };

      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://127.0.0.1:8000/api/characters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(character)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Character created:', data);
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

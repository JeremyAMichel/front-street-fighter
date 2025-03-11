"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Character {
  id: number;
  name: string;
  imagePath: string;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

const CharacterCard = ({
  character,
  onDelete,
  onEdit,
}: {
  character: Character;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={"https://127.0.0.1:8000" + character.imagePath || "/placeholder.svg"} alt={character.name} />
            <AvatarFallback>
              {character.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{character.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm">
              <span>Force</span>
              <span>{character.strength}</span>
            </div>
            <Progress value={character.strength} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Vitesse</span>
              <span>{character.speed}</span>
            </div>
            <Progress value={character.speed} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Endurance</span>
              <span>{character.durability}</span>
            </div>
            <Progress value={character.durability} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Puissance</span>
              <span>{character.power}</span>
            </div>
            <Progress value={character.power} className="h-2 bg-white" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Combat</span>
              <span>{character.combat}</span>
            </div>
            <Progress value={character.combat} className="h-2 bg-white" />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <Button onClick={() => onEdit(character.id)} variant="outline">
              Modifier
            </Button>
            <Button
              onClick={() => onDelete(character.id)}
              variant="destructive"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
    }
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwtToken");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("https://127.0.0.1:8000/api/characters", {
        headers
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération des personnages");
      }

      const data = await response.json();
      setCharacters(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des personnages:", err);
      setError("Impossible de charger les personnages. Veuillez réessayer plus tard.");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Vous devez être connecté pour supprimer un personnage");
        return;
      }

      const response = await fetch(`https://127.0.0.1:8000/api/characters/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Échec de la suppression du personnage");
      }

      // Mettre à jour l'état local après la suppression réussie
      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== id)
      );
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Impossible de supprimer le personnage. Veuillez réessayer plus tard.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/modification/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Les Combattants
        </motion.h1>

        {isAuthenticated && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => router.push("/creation")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Créer un nouveau combattant
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-6 bg-gray-800 rounded-lg">
            <p>{error}</p>
            <Button onClick={fetchCharacters} className="mt-4">
              Réessayer
            </Button>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <p className="text-xl mb-4">Aucun personnage disponible</p>
            {isAuthenticated && (
              <p>Créez votre premier combattant pour commencer!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CharacterCard
                  character={character}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
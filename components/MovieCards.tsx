import { Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const MovieCards = ({ id, poster_path, title, vote_average }: Movie) => {
  console.log(poster_path);
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : `https/placeholder.co/600*400/1a1a1a/ffffff.png`,
            //   : `https://via.placeholder/500*750`,
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-sm font-bold mt-2 text-white">{title}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCards;

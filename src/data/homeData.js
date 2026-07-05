import {
  FaMusic,
  FaNewspaper,
  FaGuitar,
  FaSpotify,
  FaBullhorn,
  FaTshirt,
} from "react-icons/fa";

export const homeData = {
  hero: {
    title: "Nuestra Última Sesión en Vivo",

    youtube: "https://www.youtube.com/embed/YVQp1E9Ng4Y",
  },

latestLeft: [

    {
        id:1,
        type:"youtube",
        icon:FaMusic,
        title:"Nueva sesión disponible",
        description:"Firulais",
        image:"",
        url:"https://youtube.com/...",
        published:"Hace 2 días"
    },

    {
        id:2,
        type:"instagram",
        icon:FaNewspaper,
        title:"Nueva noticia",
        description:"Cobertura del festival",
        image:"",
        url:"#",
        published:"Hace 1 día"
    },

    {
        id:3,
        type:"festival",
        icon:FaGuitar,
        title:"Próximo festival",
        description:"Reciclarte 2026",
        image:"",
        url:"#",
        published:"Próximamente"
    }

],

latestRight:[

    {
        id:1,
        type:"spotify",
        icon:FaSpotify,
        title:"Playlist actualizada",
        description:"Rock Paraguayo",
        image:"",
        url:"#",
        published:"Hace 3 días"
    },

    {
        id:2,
        type:"announcement",
        icon:FaBullhorn,
        title:"Convocatoria abierta",
        description:"Indie Sounds Sessions",
        image:"",
        url:"#",
        published:"Abierta"
    },

    {
        id:3,
        type:"merch",
        icon:FaTshirt,
        title:"Nuevo Merch",
        description:"Remera Oficial",
        image:"",
        url:"#",
        published:"Disponible"
    }

],

  merch: [],

  news: [],

  playlists: [],
};

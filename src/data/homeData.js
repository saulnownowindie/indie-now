import serotoninLogo from "../assets/images/serotonin.jpg";
import coverSomething from "../assets/images/something in the way.jpg";
import coverTakeMeOut from "../assets/images/take me out.jpg";
import coverWhiteTeeth from "../assets/images/white teeth teens.jpg";
import mockupSerotonin from "../assets/merch/mockup-serotonin.jpg";
import mockupSerotonin2 from "../assets/merch/mockup-serotonin-2.jpg";

import mockupTakeMeOut from "../assets/merch/mockup-take-me-out.jpg";
import mockupTakeMeOut2 from "../assets/merch/mockup-take-me-out-2.jpg";

import mockupSomething from "../assets/merch/mockup-something-in-the-way.jpg";

import mockupWhiteTeeth from "../assets/merch/mockup-white-teeth-teens.jpg";
import mockupWhiteTeeth2 from "../assets/merch/mockup-white-teeth-teens-2.jpg";

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
    title: "ÚLTIMA INDIE SOUNDS SESSION",

    youtube: "https://www.youtube.com/embed/YVQp1E9Ng4Y",

    youtubeUrl: "https://www.youtube.com/watch?v=YVQp1E9Ng4Y",
  },

  newWorth: [
    {
      id: 1,
      category: "Sesión",
      title: "Firulais y una sesión que redefine el indie local",
      date: "15 Julio 2026",
      image: serotoninLogo,
      url: "https://www.youtube.com/watch?v=YVQp1E9Ng4Y",
    },
    {
      id: 2,
      category: "Reseña",
      title: "Take Me Out: guitarras que no piden permiso",
      date: "12 Julio 2026",
      image: coverTakeMeOut,
      url: "#",
    },
    {
      id: 3,
      category: "Noticias",
      title: "Something In The Way y el nuevo rumbo del sello",
      date: "10 Julio 2026",
      image: coverSomething,
      url: "#",
    },
    {
      id: 4,
      category: "Playlist",
      title: "White Teeth Teens: la playlist de la semana",
      image: coverWhiteTeeth,
      url: "#",
    },
  ],

  latestLeft: [
    {
      id: 1,
      type: "youtube",
      icon: FaMusic,
      title: "Nueva sesión disponible",
      description: "Firulais",
      image: "",
      url: "https://youtube.com/...",
      published: "Hace 2 días",
    },

    {
      id: 2,
      type: "instagram",
      icon: FaNewspaper,
      title: "Nueva noticia",
      description: "Cobertura del festival",
      image: "",
      url: "#",
      published: "Hace 1 día",
    },

    {
      id: 3,
      type: "festival",
      icon: FaGuitar,
      title: "Próximo festival",
      description: "Reciclarte 2026",
      image: "",
      url: "#",
      published: "Próximamente",
    },
  ],

  latestRight: [
    {
      id: 1,
      type: "spotify",
      icon: FaSpotify,
      title: "Playlist actualizada",
      description: "Rock Paraguayo",
      image: "",
      url: "#",
      published: "Hace 3 días",
    },

    {
      id: 2,
      type: "announcement",
      icon: FaBullhorn,
      title: "Convocatoria abierta",
      description: "Indie Sounds Sessions",
      image: "",
      url: "#",
      published: "Abierta",
    },

    {
      id: 3,
      type: "merch",
      icon: FaTshirt,
      title: "Nuevo Merch",
      description: "Remera Oficial",
      image: "",
      url: "#",
      published: "Disponible",
    },
  ],

  merch: {
    title: "Merch Oficial",

    subtitle: "Diseños originales creados por Indie Now.",

    tshirts: [
      {
        id: 1,

        name: "Serotonin",

        collection: "Colección Indie Now",

        price: "Gs. 90.000",

        details: [
          {
            label: "Material",
            value: "100% Algodón",
          },
          {
            label: "Corte",
            value: "Oversize",
          },
          {
            label: "Estampado",
            value: "DTF Premium",
          },
          {
            label: "Color",
            value: "Negro",
          },
        ],

        image: mockupSerotonin,

        gallery: [mockupSerotonin, mockupSerotonin2],

        badge: "Nuevo",

        url: "#",
      },
      {
        id: 2,

        name: "Take Me Out",

        collection: "Colección Indie Now",

        price: "Gs. 90.000",

        details: [
          {
            label: "Material",
            value: "100% Algodón",
          },
          {
            label: "Corte",
            value: "Oversize",
          },
          {
            label: "Estampado",
            value: "DTF Premium",
          },
          {
            label: "Color",
            value: "Negro",
          },
        ],

        image: mockupTakeMeOut,

        gallery: [mockupTakeMeOut, mockupTakeMeOut2],

        badge: "Nuevo",

        url: "#",
      },
      {
        id: 3,

        name: "Something In The Way",

        collection: "Colección Indie Now",

        price: "Gs. 90.000",

        details: [
          {
            label: "Material",
            value: "100% Algodón",
          },
          {
            label: "Corte",
            value: "Oversize",
          },
          {
            label: "Estampado",
            value: "DTF Premium",
          },
          {
            label: "Color",
            value: "Negro",
          },
        ],

        color: "Negro",

        image: mockupSomething,

        gallery: [mockupSomething],

        badge: "Nuevo",

        url: "#",
      },

      {
        id: 4,

        name: "White Teeth Teens",

        collection: "Colección Indie Now",

        price: "Gs. 90.000",

        details: [
          {
            label: "Material",

            value: "100% Algodón",
          },

          {
            label: "Corte",

            value: "Oversize",
          },

          {
            label: "Estampado",

            value: "DTF Premium",
          },

          {
            label: "Color",

            value: "Negro",
          },
        ],

        image: mockupWhiteTeeth,

        gallery: [mockupWhiteTeeth, mockupWhiteTeeth2],

        badge: "Nuevo",

        url: "#",
      },
    ],
  },
  news: [
    {
      id: 1,
      category: "Noticias",
      title: "El indie paraguayo se toma los escenarios de verano",
      date: "18 Julio 2026",
      image: coverTakeMeOut,
      url: "#",
    },
    {
      id: 2,
      category: "Noticias",
      title: "Nuevos sellos independientes que hay que seguir",
      date: "16 Julio 2026",
      image: coverWhiteTeeth,
      url: "#",
    },
    {
      id: 3,
      category: "Noticias",
      title: "La escena bedroom pop prepara su propio festival",
      date: "14 Julio 2026",
      image: coverSomething,
      url: "#",
    },
  ],

  pressNotes: [
    {
      id: 1,
      category: "Nota de Prensa",
      title: "Serotonin: el debut que mezcla shoegaze y nostalgia",
      date: "8 Julio 2026",
      image: serotoninLogo,
      url: "#",
    },
    {
      id: 2,
      category: "Nota de Prensa",
      title: "Take Me Out y una reinvención del rock de garage",
      date: "5 Julio 2026",
      image: coverTakeMeOut,
      url: "#",
    },
    {
      id: 3,
      category: "Nota de Prensa",
      title: "White Teeth Teens: himnos para la generación ansiosa",
      date: "2 Julio 2026",
      image: coverWhiteTeeth,
      url: "#",
    },
  ],

  sessions: [
    {
      id: 1,
      category: "Session #14",
      title: "Firulais — Indie Sounds Session",
      date: "15 Julio 2026",
      image: serotoninLogo,
      url: "https://www.youtube.com/watch?v=YVQp1E9Ng4Y",
    },
    {
      id: 2,
      category: "Session #13",
      title: "Los Perros — Indie Sounds Session",
      date: "1 Julio 2026",
      image: coverTakeMeOut,
      url: "#",
    },
    {
      id: 3,
      category: "Session #12",
      title: "Nube — Indie Sounds Session",
      date: "18 Junio 2026",
      image: coverWhiteTeeth,
      url: "#",
    },
  ],

  mustSee: [
    {
      id: 1,
      category: "Playlist",
      title: "Playlist de YouTube: lo mejor del mes",
      image: coverTakeMeOut,
      url: "https://www.youtube.com/@INDIENOW/playlists",
    },
    {
      id: 2,
      category: "Festivales",
      title: "Festivales 2026: agenda y coberturas",
      image: mockupTakeMeOut,
      url: "#",
    },
    {
      id: 3,
      category: "Coberturas",
      title: "Coberturas: lo que dejó la temporada",
      image: mockupWhiteTeeth,
      url: "#",
    },
  ],

  spotifyPlaylist: {
    title: "Rock Paraguayo",
    description: "La playlist de Indie Now para descubrir la escena local.",
    url: "https://open.spotify.com/user/23nomspw5w0lofcqo0bbgj8du?si=24dcebd47c76406f",
  },

  submitMusic: [
    {
      id: 1,
      name: "Groover",
      description:
        "Llegá a curadores, radios y playlists de todo el mundo.",
      url: "https://groover.co",
    },
    {
      id: 2,
      name: "Musosoup",
      description:
        "Conectá tu música con medios, blogs y sincronizaciones.",
      url: "https://musosoup.com",
    },
    {
      id: 3,
      name: "Independiza",
      description:
        "Distribuí y gestioná tu música de forma independiente.",
      url: "https://www.independizamusica.com",
    },
  ],

  reels: [
    {
      id: 1,
      platform: "Reel",
      title: "Backstage: la sesión de Firulais",
      image: serotoninLogo,
      url: "https://www.instagram.com/indienownow/",
    },
    {
      id: 2,
      platform: "Reel",
      title: "Así suena el nuevo single de Take Me Out",
      image: coverTakeMeOut,
      url: "https://www.instagram.com/indienownow/",
    },
    {
      id: 3,
      platform: "Reel",
      title: "3 discos para empezar la semana",
      image: coverSomething,
      url: "https://www.instagram.com/indienownow/",
    },
    {
      id: 4,
      platform: "Cobertura",
      title: "Lo que pasó en el festival",
      image: mockupTakeMeOut,
      url: "https://www.instagram.com/indienownow/",
    },
    {
      id: 5,
      platform: "Reel",
      title: "White Teeth Teens en vivo",
      image: coverWhiteTeeth,
      url: "https://www.instagram.com/indienownow/",
    },
  ],

  playlists: [],
};

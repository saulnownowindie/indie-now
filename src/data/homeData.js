import serotoninLogo from "../assets/images/serotonin.jpg";
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
    title: "Nuestra Última Sesión en Vivo",

    youtube: "https://www.youtube.com/embed/YVQp1E9Ng4Y",
  },

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
  news: [],

  playlists: [],
};

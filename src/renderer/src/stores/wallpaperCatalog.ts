export interface CuratedWallpaper {
  id: string;
  label: string;
  url: string;
  thumb: string;
  categoryId: string;
}

export interface WallpaperCategory {
  id: string;
  label: string;
  desc: string;
  items: CuratedWallpaper[];
}

export const EXCO_BRAND_WALLPAPER = './wallpapers/exco-brand.svg';
export const AUTO_WALLPAPER_ID = '__auto_daily__';

export const WALLPAPER_CATEGORIES: WallpaperCategory[] = [
  {
    "id": "space",
    "label": "Space & Nebulae",
    "desc": "Deep-space JWST, Hubble nebulae & galaxies",
    "items": [
      {
        "id": "space-1",
        "label": "Carina Cosmic Cliffs",
        "url": "./wallpapers/space-nebula.jpg",
        "thumb": "./wallpapers/space-nebula.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-2",
        "label": "Cosmic Galaxy Vista",
        "url": "./wallpapers/cosmic-galaxy.jpg",
        "thumb": "./wallpapers/cosmic-galaxy.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-3",
        "label": "Space Vista 3",
        "url": "./wallpapers/space/space-3.jpg",
        "thumb": "./wallpapers/space/space-3.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-4",
        "label": "Space Vista 4",
        "url": "./wallpapers/space/space-4.jpg",
        "thumb": "./wallpapers/space/space-4.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-5",
        "label": "Space Vista 5",
        "url": "./wallpapers/space/space-5.jpg",
        "thumb": "./wallpapers/space/space-5.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-6",
        "label": "Space Vista 6",
        "url": "./wallpapers/space/space-6.jpg",
        "thumb": "./wallpapers/space/space-6.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-7",
        "label": "Space Vista 7",
        "url": "./wallpapers/space/space-7.jpg",
        "thumb": "./wallpapers/space/space-7.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-8",
        "label": "Space Vista 8",
        "url": "./wallpapers/space/space-8.jpg",
        "thumb": "./wallpapers/space/space-8.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-9",
        "label": "Space Vista 9",
        "url": "./wallpapers/space/space-9.jpg",
        "thumb": "./wallpapers/space/space-9.jpg",
        "categoryId": "space"
      },
      {
        "id": "space-10",
        "label": "Space Vista 10",
        "url": "./wallpapers/space/space-10.jpg",
        "thumb": "./wallpapers/space/space-10.jpg",
        "categoryId": "space"
      }
    ]
  },
  {
    "id": "astronomy",
    "label": "Earth & Cosmos",
    "desc": "Orbital Earth horizons & cosmic vistas",
    "items": [
      {
        "id": "astronomy-1",
        "label": "Earth Orbital Horizon",
        "url": "./wallpapers/earth-horizon.jpg",
        "thumb": "./wallpapers/earth-horizon.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-2",
        "label": "Earth Vista 2",
        "url": "./wallpapers/astronomy/astronomy-2.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-2.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-3",
        "label": "Earth Vista 3",
        "url": "./wallpapers/astronomy/astronomy-3.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-3.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-4",
        "label": "Earth Vista 4",
        "url": "./wallpapers/astronomy/astronomy-4.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-4.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-5",
        "label": "Earth Vista 5",
        "url": "./wallpapers/astronomy/astronomy-5.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-5.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-6",
        "label": "Earth Vista 6",
        "url": "./wallpapers/astronomy/astronomy-6.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-6.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-7",
        "label": "Earth Vista 7",
        "url": "./wallpapers/astronomy/astronomy-7.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-7.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-8",
        "label": "Earth Vista 8",
        "url": "./wallpapers/astronomy/astronomy-8.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-8.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-9",
        "label": "Earth Vista 9",
        "url": "./wallpapers/astronomy/astronomy-9.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-9.jpg",
        "categoryId": "astronomy"
      },
      {
        "id": "astronomy-10",
        "label": "Earth Vista 10",
        "url": "./wallpapers/astronomy/astronomy-10.jpg",
        "thumb": "./wallpapers/astronomy/astronomy-10.jpg",
        "categoryId": "astronomy"
      }
    ]
  },
  {
    "id": "aurora",
    "label": "Aurora & Night Sky",
    "desc": "Northern lights, starry nights & dusk skies",
    "items": [
      {
        "id": "aurora-1",
        "label": "Arctic Aurora Borealis",
        "url": "./wallpapers/aurora-night.jpg",
        "thumb": "./wallpapers/aurora-night.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-2",
        "label": "Aurora Vista 2",
        "url": "./wallpapers/aurora/aurora-2.jpg",
        "thumb": "./wallpapers/aurora/aurora-2.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-3",
        "label": "Aurora Vista 3",
        "url": "./wallpapers/aurora/aurora-3.jpg",
        "thumb": "./wallpapers/aurora/aurora-3.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-4",
        "label": "Aurora Vista 4",
        "url": "./wallpapers/aurora/aurora-4.jpg",
        "thumb": "./wallpapers/aurora/aurora-4.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-5",
        "label": "Aurora Vista 5",
        "url": "./wallpapers/aurora/aurora-5.jpg",
        "thumb": "./wallpapers/aurora/aurora-5.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-6",
        "label": "Aurora Vista 6",
        "url": "./wallpapers/aurora/aurora-6.jpg",
        "thumb": "./wallpapers/aurora/aurora-6.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-7",
        "label": "Aurora Vista 7",
        "url": "./wallpapers/aurora/aurora-7.jpg",
        "thumb": "./wallpapers/aurora/aurora-7.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-8",
        "label": "Aurora Vista 8",
        "url": "./wallpapers/aurora/aurora-8.jpg",
        "thumb": "./wallpapers/aurora/aurora-8.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-9",
        "label": "Aurora Vista 9",
        "url": "./wallpapers/aurora/aurora-9.jpg",
        "thumb": "./wallpapers/aurora/aurora-9.jpg",
        "categoryId": "aurora"
      },
      {
        "id": "aurora-10",
        "label": "Aurora Vista 10",
        "url": "./wallpapers/aurora/aurora-10.jpg",
        "thumb": "./wallpapers/aurora/aurora-10.jpg",
        "categoryId": "aurora"
      }
    ]
  },
  {
    "id": "mountains",
    "label": "Alpine Mountains",
    "desc": "Majestic ridges, misty valleys & alpine peaks",
    "items": [
      {
        "id": "mountains-1",
        "label": "Alpine Dusk Peaks",
        "url": "./wallpapers/alpine-peaks.jpg",
        "thumb": "./wallpapers/alpine-peaks.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-2",
        "label": "Cinnabar on Dolomite",
        "url": "./wallpapers/mountains/mountains-2.jpg",
        "thumb": "./wallpapers/mountains/mountains-2.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-3",
        "label": "Dolomite Magnésite Navarre",
        "url": "./wallpapers/mountains/mountains-3.jpg",
        "thumb": "./wallpapers/mountains/mountains-3.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-4",
        "label": "Dolomite Luzenac",
        "url": "./wallpapers/mountains/mountains-4.jpg",
        "thumb": "./wallpapers/mountains/mountains-4.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-5",
        "label": "Sella group panorama",
        "url": "./wallpapers/mountains/mountains-5.jpg",
        "thumb": "./wallpapers/mountains/mountains-5.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-6",
        "label": "Saslonch cun legrima",
        "url": "./wallpapers/mountains/mountains-6.jpg",
        "thumb": "./wallpapers/mountains/mountains-6.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-7",
        "label": "Tschapit Rosszähne Seiseralm",
        "url": "./wallpapers/mountains/mountains-7.jpg",
        "thumb": "./wallpapers/mountains/mountains-7.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-8",
        "label": "Dolomites (28627291084)",
        "url": "./wallpapers/mountains/mountains-8.jpg",
        "thumb": "./wallpapers/mountains/mountains-8.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-9",
        "label": "Crëpes de Gherdëina da Secëda nëif d'agost",
        "url": "./wallpapers/mountains/mountains-9.jpg",
        "thumb": "./wallpapers/mountains/mountains-9.jpg",
        "categoryId": "mountains"
      },
      {
        "id": "mountains-10",
        "label": "Panoramic view from Lido die Venezia across Ve",
        "url": "./wallpapers/mountains/mountains-10.jpg",
        "thumb": "./wallpapers/mountains/mountains-10.jpg",
        "categoryId": "mountains"
      }
    ]
  },
  {
    "id": "forest",
    "label": "Forests & Nature",
    "desc": "Lush emerald pines, wilderness & foliage",
    "items": [
      {
        "id": "forest-1",
        "label": "Misty Emerald Forest",
        "url": "./wallpapers/emerald-forest.jpg",
        "thumb": "./wallpapers/emerald-forest.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-2",
        "label": "Shishkin, Ivan Morning in a Pine Forest",
        "url": "./wallpapers/forest/forest-2.jpg",
        "thumb": "./wallpapers/forest/forest-2.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-3",
        "label": "Neuschwanstein Castle from Marienbrücke, 2011 ",
        "url": "./wallpapers/forest/forest-3.jpg",
        "thumb": "./wallpapers/forest/forest-3.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-4",
        "label": "R'as Al matn pine forest Lebanon",
        "url": "./wallpapers/forest/forest-4.jpg",
        "thumb": "./wallpapers/forest/forest-4.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-5",
        "label": "Pine Forest (Gn. Halimun Salak National Park) ",
        "url": "./wallpapers/forest/forest-5.jpg",
        "thumb": "./wallpapers/forest/forest-5.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-6",
        "label": "Bristlecone pine forest janine sprout",
        "url": "./wallpapers/forest/forest-6.jpg",
        "thumb": "./wallpapers/forest/forest-6.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-7",
        "label": "Pine forest and beech forest",
        "url": "./wallpapers/forest/forest-7.jpg",
        "thumb": "./wallpapers/forest/forest-7.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-8",
        "label": "Pine forest in Altkönig",
        "url": "./wallpapers/forest/forest-8.jpg",
        "thumb": "./wallpapers/forest/forest-8.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-9",
        "label": "Uttarakhand Pine Forest",
        "url": "./wallpapers/forest/forest-9.jpg",
        "thumb": "./wallpapers/forest/forest-9.jpg",
        "categoryId": "forest"
      },
      {
        "id": "forest-10",
        "label": "Khajiyar Pine Forest",
        "url": "./wallpapers/forest/forest-10.jpg",
        "thumb": "./wallpapers/forest/forest-10.jpg",
        "categoryId": "forest"
      }
    ]
  },
  {
    "id": "ocean",
    "label": "Ocean & Waterfalls",
    "desc": "Deep sea waves, coastlines & cascades",
    "items": [
      {
        "id": "ocean-1",
        "label": "Deep Ocean Swell",
        "url": "./wallpapers/ocean-waves.jpg",
        "thumb": "./wallpapers/ocean-waves.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-2",
        "label": "Ocean Vista 2",
        "url": "./wallpapers/ocean/ocean-2.jpg",
        "thumb": "./wallpapers/ocean/ocean-2.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-3",
        "label": "Ocean Vista 3",
        "url": "./wallpapers/ocean/ocean-3.jpg",
        "thumb": "./wallpapers/ocean/ocean-3.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-4",
        "label": "Ocean Vista 4",
        "url": "./wallpapers/ocean/ocean-4.jpg",
        "thumb": "./wallpapers/ocean/ocean-4.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-5",
        "label": "Ocean Vista 5",
        "url": "./wallpapers/ocean/ocean-5.jpg",
        "thumb": "./wallpapers/ocean/ocean-5.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-6",
        "label": "Ocean Vista 6",
        "url": "./wallpapers/ocean/ocean-6.jpg",
        "thumb": "./wallpapers/ocean/ocean-6.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-7",
        "label": "Ocean Vista 7",
        "url": "./wallpapers/ocean/ocean-7.jpg",
        "thumb": "./wallpapers/ocean/ocean-7.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-8",
        "label": "Boelge stor",
        "url": "./wallpapers/ocean/ocean-8.jpg",
        "thumb": "./wallpapers/ocean/ocean-8.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-9",
        "label": "William Adolphe Bouguereau (1825 1905) The Wav",
        "url": "./wallpapers/ocean/ocean-9.jpg",
        "thumb": "./wallpapers/ocean/ocean-9.jpg",
        "categoryId": "ocean"
      },
      {
        "id": "ocean-10",
        "label": "The Great Wave off Kanagawa",
        "url": "./wallpapers/ocean/ocean-10.jpg",
        "thumb": "./wallpapers/ocean/ocean-10.jpg",
        "categoryId": "ocean"
      }
    ]
  },
  {
    "id": "cyberpunk",
    "label": "Cityscapes & Neon",
    "desc": "Night skylines, urban lights & cyber streets",
    "items": [
      {
        "id": "cyberpunk-1",
        "label": "Neon Rain Street",
        "url": "./wallpapers/neon-city.jpg",
        "thumb": "./wallpapers/neon-city.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-2",
        "label": "Cityscapes Vista 2",
        "url": "./wallpapers/cyberpunk/cyberpunk-2.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-2.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-3",
        "label": "Tokyo Big Sight at Night",
        "url": "./wallpapers/cyberpunk/cyberpunk-3.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-3.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-4",
        "label": "Tokyo Skytree at night (White)",
        "url": "./wallpapers/cyberpunk/cyberpunk-4.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-4.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-5",
        "label": "Night in Shinjuku 3",
        "url": "./wallpapers/cyberpunk/cyberpunk-5.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-5.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-6",
        "label": "Tokyo Shibuya Scramble Crossing 2018 10 09",
        "url": "./wallpapers/cyberpunk/cyberpunk-6.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-6.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-7",
        "label": "Tokyo Night (14519874626)",
        "url": "./wallpapers/cyberpunk/cyberpunk-7.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-7.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-8",
        "label": "Colorful neon street signs in Kabukichō, Shinj",
        "url": "./wallpapers/cyberpunk/cyberpunk-8.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-8.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-9",
        "label": "Green and yellow taxi at night in Yasukuni dor",
        "url": "./wallpapers/cyberpunk/cyberpunk-9.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-9.jpg",
        "categoryId": "cyberpunk"
      },
      {
        "id": "cyberpunk-10",
        "label": "Yasukuni dori Avenue at night with vehicles an",
        "url": "./wallpapers/cyberpunk/cyberpunk-10.jpg",
        "thumb": "./wallpapers/cyberpunk/cyberpunk-10.jpg",
        "categoryId": "cyberpunk"
      }
    ]
  },
  {
    "id": "architecture",
    "label": "Sakura & Architecture",
    "desc": "Blossoms, minimalist concrete & geometry",
    "items": [
      {
        "id": "architecture-1",
        "label": "Kyoto Cherry Blossoms",
        "url": "./wallpapers/cherry-blossom.jpg",
        "thumb": "./wallpapers/cherry-blossom.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-2",
        "label": "Lake Kawaguchiko Sakura Mount Fuji 4",
        "url": "./wallpapers/architecture/architecture-2.jpg",
        "thumb": "./wallpapers/architecture/architecture-2.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-3",
        "label": "Mt Hiei with Cherry Blossom",
        "url": "./wallpapers/architecture/architecture-3.jpg",
        "thumb": "./wallpapers/architecture/architecture-3.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-4",
        "label": "Cherry blossom buds 1",
        "url": "./wallpapers/architecture/architecture-4.jpg",
        "thumb": "./wallpapers/architecture/architecture-4.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-5",
        "label": "Cherry blossom buds 1 cropped",
        "url": "./wallpapers/architecture/architecture-5.jpg",
        "thumb": "./wallpapers/architecture/architecture-5.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-6",
        "label": "Yoshino yama cherry blossom 2018 Luka Peternel",
        "url": "./wallpapers/architecture/architecture-6.jpg",
        "thumb": "./wallpapers/architecture/architecture-6.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-7",
        "label": "Yoshino yama hills cherry blossom 2018 Luka Pe",
        "url": "./wallpapers/architecture/architecture-7.jpg",
        "thumb": "./wallpapers/architecture/architecture-7.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-8",
        "label": "Takada Castle Cherry Blossom Festival",
        "url": "./wallpapers/architecture/architecture-8.jpg",
        "thumb": "./wallpapers/architecture/architecture-8.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-9",
        "label": "Cherry blossom P1000452",
        "url": "./wallpapers/architecture/architecture-9.jpg",
        "thumb": "./wallpapers/architecture/architecture-9.jpg",
        "categoryId": "architecture"
      },
      {
        "id": "architecture-10",
        "label": "Cherry Blossom in El Retiro Park, Madrid, Spai",
        "url": "./wallpapers/architecture/architecture-10.jpg",
        "thumb": "./wallpapers/architecture/architecture-10.jpg",
        "categoryId": "architecture"
      }
    ]
  },
  {
    "id": "desert",
    "label": "Desert & Sunsets",
    "desc": "Golden dunes, warm horizons & canyons",
    "items": [
      {
        "id": "desert-1",
        "label": "Golden Sunset Dunes",
        "url": "./wallpapers/desert-dunes.jpg",
        "thumb": "./wallpapers/desert-dunes.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-2",
        "label": "Sossusvlei sand dunes",
        "url": "./wallpapers/desert/desert-2.jpg",
        "thumb": "./wallpapers/desert/desert-2.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-3",
        "label": "Mesquite Sand Dunes in Death Valley",
        "url": "./wallpapers/desert/desert-3.jpg",
        "thumb": "./wallpapers/desert/desert-3.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-4",
        "label": "Desiccation cracks and Sand Dunes in Death Val",
        "url": "./wallpapers/desert/desert-4.jpg",
        "thumb": "./wallpapers/desert/desert-4.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-5",
        "label": "Great Sand Dunes NP 1",
        "url": "./wallpapers/desert/desert-5.jpg",
        "thumb": "./wallpapers/desert/desert-5.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-6",
        "label": "Namib Naukluft Sand Dunes (2011)",
        "url": "./wallpapers/desert/desert-6.jpg",
        "thumb": "./wallpapers/desert/desert-6.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-7",
        "label": "Thatched cottage in the sand dunes by Denmark",
        "url": "./wallpapers/desert/desert-7.jpg",
        "thumb": "./wallpapers/desert/desert-7.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-8",
        "label": "Death Valley Mesquite Flats Sand Dunes 2013",
        "url": "./wallpapers/desert/desert-8.jpg",
        "thumb": "./wallpapers/desert/desert-8.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-9",
        "label": "Mesquite Flat Sand Dunes Panorama Morning 2013",
        "url": "./wallpapers/desert/desert-9.jpg",
        "thumb": "./wallpapers/desert/desert-9.jpg",
        "categoryId": "desert"
      },
      {
        "id": "desert-10",
        "label": "Dune de sable au parc Culturel De l'Ahaggar cr",
        "url": "./wallpapers/desert/desert-10.jpg",
        "thumb": "./wallpapers/desert/desert-10.jpg",
        "categoryId": "desert"
      }
    ]
  },
  {
    "id": "abstract",
    "label": "Abstract & Studio Bokeh",
    "desc": "Iridescent macro art, textures & calm bokeh",
    "items": [
      {
        "id": "abstract-1",
        "label": "Midnight Rain Bokeh",
        "url": "./wallpapers/cozy-rain.jpg",
        "thumb": "./wallpapers/cozy-rain.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-2",
        "label": "Catadioptric system bokeh christmas tree light",
        "url": "./wallpapers/abstract/abstract-2.jpg",
        "thumb": "./wallpapers/abstract/abstract-2.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-3",
        "label": "ChristmasLights bokeh",
        "url": "./wallpapers/abstract/abstract-3.jpg",
        "thumb": "./wallpapers/abstract/abstract-3.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-4",
        "label": "Lights dark abstract bokeh (24326849395)",
        "url": "./wallpapers/abstract/abstract-4.jpg",
        "thumb": "./wallpapers/abstract/abstract-4.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-5",
        "label": "Bokeh from the front holiday lights. Explore t",
        "url": "./wallpapers/abstract/abstract-5.jpg",
        "thumb": "./wallpapers/abstract/abstract-5.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-6",
        "label": "Christmas Lights Bokeh Effect (Unsplash)",
        "url": "./wallpapers/abstract/abstract-6.jpg",
        "thumb": "./wallpapers/abstract/abstract-6.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-7",
        "label": "Bokeh the lights of Christmas (Unsplash)",
        "url": "./wallpapers/abstract/abstract-7.jpg",
        "thumb": "./wallpapers/abstract/abstract-7.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-8",
        "label": "Bokeh, bokeh everywhere (23409259469)",
        "url": "./wallpapers/abstract/abstract-8.jpg",
        "thumb": "./wallpapers/abstract/abstract-8.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-9",
        "label": "Christmas tree lights in bokeh (4274605105)",
        "url": "./wallpapers/abstract/abstract-9.jpg",
        "thumb": "./wallpapers/abstract/abstract-9.jpg",
        "categoryId": "abstract"
      },
      {
        "id": "abstract-10",
        "label": "EOS RF 50 F12. bokeh distant lights (313519258",
        "url": "./wallpapers/abstract/abstract-10.jpg",
        "thumb": "./wallpapers/abstract/abstract-10.jpg",
        "categoryId": "abstract"
      }
    ]
  }
];

export const ALL_CURATED_WALLPAPERS: CuratedWallpaper[] = WALLPAPER_CATEGORIES.flatMap(c => c.items);

export function getNextAutoWallpaper(currentUrl?: string, categoryId?: string): CuratedWallpaper {
  const pool =
    categoryId && categoryId !== 'all'
      ? WALLPAPER_CATEGORIES.find(c => c.id === categoryId)?.items || ALL_CURATED_WALLPAPERS
      : ALL_CURATED_WALLPAPERS;

  if (!currentUrl) {
    return pool[0];
  }

  const currentIdx = pool.findIndex(w => w.url === currentUrl);
  if (currentIdx !== -1) {
    return pool[(currentIdx + 1) % pool.length];
  }

  return pool[0];
}

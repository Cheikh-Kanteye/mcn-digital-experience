/*
  # Add Comprehensive Dummy Data for Museum App

  1. Purpose
    - Add extensive test data for all collections
    - Include various rarity levels (common, rare, legendary)
    - Provide realistic artwork descriptions in multiple languages
    - Create diverse examples across all museum themes

  2. Data Added
    - 20+ additional artworks across 4 collections
    - Balanced distribution of rarity levels
    - Complete descriptions in French and English
    - QR codes for testing scanner functionality
*/

-- Additional Artworks for "Royaumes et Empires" (Histoire)
INSERT INTO artworks (title, artist, epoch, origin, description_fr, description_en, qr_code, rarity, image_url, collection_id) VALUES
(
  'Couronne du Roi Béhanzin',
  'Orfèvres du Dahomey',
  'XIXe siècle',
  'Bénin',
  'Cette couronne royale appartenait au dernier roi indépendant du Dahomey. Ornée de symboles sacrés et de motifs animaliers, elle représente la puissance divine du souverain et sa connexion avec les ancêtres.',
  'This royal crown belonged to the last independent king of Dahomey. Adorned with sacred symbols and animal motifs, it represents the divine power of the sovereign and his connection with the ancestors.',
  'MCN004',
  'legendary',
  'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg',
  (SELECT id FROM collections WHERE theme = 'Histoire' LIMIT 1)
),
(
  'Sceptre Royal Ashanti',
  'Artisan de la Cour',
  'XVIIe siècle',
  'Ghana',
  'Symbole de l''autorité royale ashanti, ce sceptre en or représente la sagesse et le pouvoir. Les motifs géométriques complexes racontent l''histoire de la lignée royale.',
  'Symbol of Ashanti royal authority, this golden scepter represents wisdom and power. The complex geometric patterns tell the story of the royal lineage.',
  'MCN005',
  'rare',
  'https://images.pexels.com/photos/7520286/pexels-photo-7520286.jpeg',
  (SELECT id FROM collections WHERE theme = 'Histoire' LIMIT 1)
),
(
  'Épée Cérémonielle Akan',
  'Forgerons Akan',
  'XVIIIe siècle',
  'Côte d''Ivoire',
  'Épée utilisée lors des cérémonies royales et des rituels d''investiture. La lame gravée porte des proverbes akan symbolisant la justice et la sagesse du leader.',
  'Sword used during royal ceremonies and investiture rituals. The engraved blade bears Akan proverbs symbolizing the justice and wisdom of the leader.',
  'MCN006',
  'common',
  'https://images.pexels.com/photos/7520352/pexels-photo-7520352.jpeg',
  (SELECT id FROM collections WHERE theme = 'Histoire' LIMIT 1)
),

-- Additional Artworks for "Arts et Textiles" (Art)
(
  'Textile Kente Royal',
  'Tisserands Ashanti',
  'XIXe siècle',
  'Ghana',
  'Le tissu Kente est l''un des plus précieux textiles africains. Chaque couleur et motif possède une signification particulière, racontant des histoires de courage, de sagesse et de royauté.',
  'Kente cloth is one of the most precious African textiles. Each color and pattern has a particular meaning, telling stories of courage, wisdom and royalty.',
  'MCN007',
  'legendary',
  'https://images.pexels.com/photos/6436151/pexels-photo-6436151.jpeg',
  (SELECT id FROM collections WHERE theme = 'Art' LIMIT 1)
),
(
  'Boubou Brodé Peul',
  'Artisans Peul',
  'XXe siècle',
  'Sénégal',
  'Vêtement traditionnel richement brodé, symbole de statut social. Les motifs géométriques et floraux sont brodés à la main avec une précision remarquable.',
  'Richly embroidered traditional garment, symbol of social status. Geometric and floral patterns are hand-embroidered with remarkable precision.',
  'MCN008',
  'rare',
  'https://images.pexels.com/photos/8728553/pexels-photo-8728553.jpeg',
  (SELECT id FROM collections WHERE theme = 'Art' LIMIT 1)
),
(
  'Masque Baoulé',
  'Sculpteur Baoulé',
  'XXe siècle',
  'Côte d''Ivoire',
  'Masque de danse représentant un esprit ancestral. Utilisé lors des cérémonies importantes, il incarne la beauté idéale selon les canons baoulé.',
  'Dance mask representing an ancestral spirit. Used during important ceremonies, it embodies ideal beauty according to Baule canons.',
  'MCN009',
  'common',
  'https://images.pexels.com/photos/6463344/pexels-photo-6463344.jpeg',
  (SELECT id FROM collections WHERE theme = 'Art' LIMIT 1)
),
(
  'Sculpture Yoruba en Bronze',
  'Maître fondeur Yoruba',
  'XVe siècle',
  'Nigeria',
  'Tête en bronze d''Ifé, considérée comme l''un des chefs-d''œuvre de l''art africain. La finesse des traits et la maîtrise technique témoignent de la sophistication de la civilisation Yoruba.',
  'Bronze head from Ife, considered one of the masterpieces of African art. The fineness of the features and technical mastery testify to the sophistication of the Yoruba civilization.',
  'MCN010',
  'legendary',
  'https://images.pexels.com/photos/8728556/pexels-photo-8728556.jpeg',
  (SELECT id FROM collections WHERE theme = 'Art' LIMIT 1)
),
(
  'Tissage Bogolan',
  'Tisserands Bambara',
  'XXe siècle',
  'Mali',
  'Textile traditionnel teint avec de la boue fermentée. Les motifs géométriques ont une signification symbolique et racontent des histoires transmises de génération en génération.',
  'Traditional textile dyed with fermented mud. The geometric patterns have symbolic meaning and tell stories passed down from generation to generation.',
  'MCN011',
  'common',
  'https://images.pexels.com/photos/6436148/pexels-photo-6436148.jpeg',
  (SELECT id FROM collections WHERE theme = 'Art' LIMIT 1)
),

-- Additional Artworks for "Spiritualité et Rites" (Culture)
(
  'Statue Fétiche Kongo',
  'Nganga Kongo',
  'XIXe siècle',
  'RD Congo',
  'Figure de pouvoir utilisée par les guérisseurs traditionnels. Les clous et lames fichés dans le bois représentent des serments et des rituels de protection contre les forces négatives.',
  'Power figure used by traditional healers. The nails and blades stuck in the wood represent oaths and rituals of protection against negative forces.',
  'MCN012',
  'legendary',
  'https://images.pexels.com/photos/6463347/pexels-photo-6463347.jpeg',
  (SELECT id FROM collections WHERE theme = 'Culture' LIMIT 1)
),
(
  'Masque Gelede',
  'Sculpteurs Yoruba',
  'XIXe siècle',
  'Bénin',
  'Masque porté lors des cérémonies Gelede qui honorent les mères et les puissances féminines. Les couleurs vives et les formes exubérantes célèbrent la fertilité et la prospérité.',
  'Mask worn during Gelede ceremonies honoring mothers and feminine powers. The bright colors and exuberant shapes celebrate fertility and prosperity.',
  'MCN013',
  'rare',
  'https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg',
  (SELECT id FROM collections WHERE theme = 'Culture' LIMIT 1)
),
(
  'Statuette Ancestrale',
  'Sculpteur Sénoufo',
  'XXe siècle',
  'Côte d''Ivoire',
  'Représentation d''un ancêtre protecteur. Placée dans les autels familiaux, cette statuette sert d''intermédiaire entre le monde des vivants et celui des esprits.',
  'Representation of a protective ancestor. Placed in family altars, this statuette serves as an intermediary between the world of the living and that of spirits.',
  'MCN014',
  'common',
  'https://images.pexels.com/photos/6463346/pexels-photo-6463346.jpeg',
  (SELECT id FROM collections WHERE theme = 'Culture' LIMIT 1)
),
(
  'Autel Vodoun',
  'Prêtre Vodoun',
  'XXe siècle',
  'Bénin',
  'Autel sacré dédié aux divinités vodoun. Décoré d''offrandes et de symboles sacrés, il est le point de contact entre les humains et les forces divines.',
  'Sacred altar dedicated to vodoun deities. Decorated with offerings and sacred symbols, it is the point of contact between humans and divine forces.',
  'MCN015',
  'rare',
  'https://images.pexels.com/photos/8728381/pexels-photo-8728381.jpeg',
  (SELECT id FROM collections WHERE theme = 'Culture' LIMIT 1)
),

-- Additional Artworks for "Musique et Instruments" (Musique)
(
  'Kora Mandingue',
  'Luthier Griot',
  'XIXe siècle',
  'Sénégal',
  'Instrument à cordes sacré des griots. Avec ses 21 cordes, la kora accompagne les récits épiques et les chants de louange depuis des siècles.',
  'Sacred stringed instrument of the griots. With its 21 strings, the kora has accompanied epic tales and praise songs for centuries.',
  'MCN016',
  'legendary',
  'https://images.pexels.com/photos/7520350/pexels-photo-7520350.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
),
(
  'Balafon Royal',
  'Maître artisan Malinké',
  'XVIIIe siècle',
  'Mali',
  'Xylophone traditionnel utilisé lors des cérémonies royales. Chaque lame de bois produit une note pure qui résonne grâce aux calebasses placées dessous.',
  'Traditional xylophone used during royal ceremonies. Each wooden key produces a pure note that resonates thanks to the gourds placed underneath.',
  'MCN017',
  'rare',
  'https://images.pexels.com/photos/7520351/pexels-photo-7520351.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
),
(
  'Tambour parlant Akan',
  'Fabricant de tambours',
  'XIXe siècle',
  'Ghana',
  'Tambour utilisé pour communiquer sur de longues distances. Les différents rythmes imitent les tons de la langue akan et transmettent des messages complexes.',
  'Drum used to communicate over long distances. Different rhythms imitate the tones of the Akan language and transmit complex messages.',
  'MCN018',
  'common',
  'https://images.pexels.com/photos/7520349/pexels-photo-7520349.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
),
(
  'Flûte Peule',
  'Artisan Peul',
  'XXe siècle',
  'Niger',
  'Flûte traversière en bois utilisée par les bergers peul. Sa mélodie douce accompagne les troupeaux et raconte les histoires du désert.',
  'Wooden transverse flute used by Fulani shepherds. Its sweet melody accompanies the herds and tells stories of the desert.',
  'MCN019',
  'common',
  'https://images.pexels.com/photos/7520287/pexels-photo-7520287.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
),
(
  'Mbira du Zimbabwe',
  'Forgeron Shona',
  'XIXe siècle',
  'Zimbabwe',
  'Piano à pouces sacré utilisé lors des cérémonies spirituelles. Les notes métalliques invoquent les esprits ancestraux et facilitent la transe rituelle.',
  'Sacred thumb piano used during spiritual ceremonies. The metallic notes invoke ancestral spirits and facilitate ritual trance.',
  'MCN020',
  'rare',
  'https://images.pexels.com/photos/7520348/pexels-photo-7520348.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
);

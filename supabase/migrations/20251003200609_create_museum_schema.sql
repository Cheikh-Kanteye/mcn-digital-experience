/*
  # Musée des Civilisations Noires - Database Schema

  1. New Tables
    - `artworks`
      - `id` (uuid, primary key)
      - `title` (text) - Nom de l'œuvre
      - `artist` (text) - Artiste/créateur
      - `epoch` (text) - Époque historique
      - `origin` (text) - Origine géographique
      - `description_fr` (text) - Description en français
      - `description_en` (text) - Description en anglais
      - `description_wo` (text) - Description en wolof
      - `audio_guide_fr` (text) - URL audio guide français
      - `audio_guide_en` (text) - URL audio guide anglais
      - `audio_guide_wo` (text) - URL audio guide wolof
      - `video_url` (text) - URL vidéo explicative
      - `image_url` (text) - Image principale
      - `image_detail_url` (text) - Image haute résolution pour zoom
      - `qr_code` (text, unique) - Code QR unique
      - `collection_id` (uuid) - Référence à la collection
      - `created_at` (timestamptz)
    
    - `collections`
      - `id` (uuid, primary key)
      - `name_fr` (text)
      - `name_en` (text)
      - `name_wo` (text)
      - `description_fr` (text)
      - `description_en` (text)
      - `description_wo` (text)
      - `theme` (text) - Thématique de la collection
      - `icon` (text) - Icône représentative
      - `created_at` (timestamptz)
    
    - `visitor_passport`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Identifiant visiteur
      - `artwork_id` (uuid) - Référence à l'œuvre
      - `scanned_at` (timestamptz) - Date de scan
      - `favorite` (boolean) - Marqué comme favori
      - `notes` (text) - Notes personnelles du visiteur
    
  2. Security
    - Enable RLS on all tables
    - Public read access for artworks and collections
    - User-specific access for visitor passport
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_wo text DEFAULT '',
  description_fr text DEFAULT '',
  description_en text DEFAULT '',
  description_wo text DEFAULT '',
  theme text NOT NULL,
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text DEFAULT '',
  epoch text NOT NULL,
  origin text NOT NULL,
  description_fr text NOT NULL,
  description_en text NOT NULL,
  description_wo text DEFAULT '',
  audio_guide_fr text DEFAULT '',
  audio_guide_en text DEFAULT '',
  audio_guide_wo text DEFAULT '',
  video_url text DEFAULT '',
  image_url text NOT NULL,
  image_detail_url text DEFAULT '',
  qr_code text UNIQUE NOT NULL,
  collection_id uuid REFERENCES collections(id),
  created_at timestamptz DEFAULT now()
);

-- Create visitor passport table
CREATE TABLE IF NOT EXISTS visitor_passport (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  scanned_at timestamptz DEFAULT now(),
  favorite boolean DEFAULT false,
  notes text DEFAULT ''
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_passport ENABLE ROW LEVEL SECURITY;

-- Collections policies (public read)
CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (true);

-- Artworks policies (public read)
CREATE POLICY "Artworks are viewable by everyone"
  ON artworks FOR SELECT
  TO anon, authenticated
  USING (true);

-- Visitor passport policies
CREATE POLICY "Users can view their own passport"
  ON visitor_passport FOR SELECT
  TO authenticated
  USING (user_id = gen_random_uuid());

CREATE POLICY "Users can insert their own passport entries"
  ON visitor_passport FOR INSERT
  TO authenticated
  WITH CHECK (user_id = gen_random_uuid());

CREATE POLICY "Users can update their own passport entries"
  ON visitor_passport FOR UPDATE
  TO authenticated
  USING (user_id = gen_random_uuid())
  WITH CHECK (user_id = gen_random_uuid());

CREATE POLICY "Users can delete their own passport entries"
  ON visitor_passport FOR DELETE
  TO authenticated
  USING (user_id = gen_random_uuid());

-- Insert sample collections
INSERT INTO collections (name_fr, name_en, name_wo, description_fr, description_en, theme, icon) VALUES
('Royaumes et Empires', 'Kingdoms and Empires', 'Réewum ak Daayam', 'Découvrez les grandes civilisations africaines et leurs systèmes de gouvernance', 'Discover great African civilizations and their governance systems', 'Histoire', '👑'),
('Arts et Textiles', 'Arts and Textiles', 'Seen ak Tikaas', 'Explorez la richesse des créations artistiques et textiles africaines', 'Explore the richness of African artistic and textile creations', 'Art', '🎨'),
('Spiritualité et Rites', 'Spirituality and Rituals', 'Diine ak Jagleel', 'Plongez dans les pratiques spirituelles et rituelles du continent', 'Dive into the spiritual and ritual practices of the continent', 'Culture', '🕯️'),
('Musique et Instruments', 'Music and Instruments', 'Musig ak Jumtukaay', 'Célébrez la diversité musicale africaine à travers les âges', 'Celebrate African musical diversity through the ages', 'Musique', '🥁')
ON CONFLICT DO NOTHING;

-- Insert sample artworks
INSERT INTO artworks (title, artist, epoch, origin, description_fr, description_en, qr_code, image_url, collection_id) VALUES
(
  'Masque Gelede',
  'Artisan Yoruba',
  'XIXe siècle',
  'Nigeria',
  'Masque cérémoniel utilisé lors des rituels Gelede pour honorer les mères ancestrales. Les motifs colorés et les sculptures représentent la fertilité et le pouvoir féminin.',
  'Ceremonial mask used in Gelede rituals to honor ancestral mothers. Colorful patterns and sculptures represent fertility and feminine power.',
  'MCN001',
  'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg',
  (SELECT id FROM collections WHERE theme = 'Culture' LIMIT 1)
),
(
  'Trône du Royaume Bamoun',
  'Artisans du Palais Royal',
  'XVIIIe siècle',
  'Cameroun',
  'Trône royal orné de motifs symboliques représentant le pouvoir et la sagesse. Chaque détail sculpté raconte une histoire de la dynastie Bamoun.',
  'Royal throne adorned with symbolic motifs representing power and wisdom. Each carved detail tells a story of the Bamoun dynasty.',
  'MCN002',
  'https://images.pexels.com/photos/8728557/pexels-photo-8728557.jpeg',
  (SELECT id FROM collections WHERE theme = 'Histoire' LIMIT 1)
),
(
  'Tambour Djembé Sacré',
  'Maître artisan Mandingue',
  'XVIIe siècle',
  'Mali',
  'Djembé cérémoniel sculpté dans un tronc unique. Les rythmes joués sur ce tambour accompagnaient les cérémonies royales et les rites de passage.',
  'Ceremonial djembe carved from a single trunk. Rhythms played on this drum accompanied royal ceremonies and rites of passage.',
  'MCN003',
  'https://images.pexels.com/photos/7520353/pexels-photo-7520353.jpeg',
  (SELECT id FROM collections WHERE theme = 'Musique' LIMIT 1)
);

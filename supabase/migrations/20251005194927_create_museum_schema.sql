-- ================================
-- 🏛️ 1. TABLES
-- ================================

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_wo TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_wo TEXT NOT NULL,
  theme TEXT NOT NULL,
  icon TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  epoch TEXT NOT NULL,
  origin TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_wo TEXT NOT NULL,
  audio_guide_fr TEXT,
  audio_guide_en TEXT,
  audio_guide_wo TEXT,
  video_url TEXT,
  image_url TEXT NOT NULL,
  image_detail_url TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  collection_id TEXT NOT NULL REFERENCES collections(id)
);

CREATE TABLE IF NOT EXISTS visitor_passport (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  artwork_id TEXT NOT NULL REFERENCES artworks(id),
  scanned_at TEXT NOT NULL,
  card_collected BOOLEAN DEFAULT FALSE,
  favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  UNIQUE(user_id, artwork_id)
);

-- ================================
-- 🔐 2. ROW LEVEL SECURITY
-- ================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_passport ENABLE ROW LEVEL SECURITY;

-- ================================
-- 🔒 3. POLICIES (version corrigée)
-- ================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on collections'
  ) THEN
    CREATE POLICY "Allow public read access on collections"
      ON collections FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on artworks'
  ) THEN
    CREATE POLICY "Allow public read access on artworks"
      ON artworks FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage their passport'
  ) THEN
    CREATE POLICY "Allow authenticated users to manage their passport"
      ON visitor_passport FOR ALL
      USING (auth.uid()::text = user_id);
  END IF;
END $$;

-- ================================
-- 🎨 4. INSERT DATA
-- ================================

INSERT INTO collections (id, name_fr, name_en, name_wo, description_fr, description_en, description_wo, theme, icon)
VALUES
  ('1', 'Royaumes et Empires', 'Kingdoms and Empires', 'Réewum ak Daayam', 'Découvrez les grandes civilisations africaines...', 'Discover great African civilizations...', 'Xam ci civilization bu mag...', 'Histoire', '👑'),
  ('2', 'Arts et Textiles', 'Arts and Textiles', 'Seen ak Tikaas', 'Explorez la richesse des créations...', 'Explore the richness of...', 'Xool richesse bu creation artistique...', 'Art', '🎨'),
  ('3', 'Spiritualité et Rites', 'Spirituality and Rituals', 'Diine ak Jagleel', 'Plongez dans les pratiques...', 'Dive into the spiritual...', 'Dugg ci pratique...', 'Culture', '🕯️'),
  ('4', 'Musique et Instruments', 'Music and Instruments', 'Musig ak Jumtukaay', 'Célébrez la diversité musicale...', 'Celebrate African musical...', 'Celebrate diversité musical...', 'Musique', '🥁')
ON CONFLICT (id) DO NOTHING;

INSERT INTO artworks (
  id, title, artist, epoch, origin, description_fr, description_en, description_wo,
  audio_guide_fr, audio_guide_en, audio_guide_wo, video_url,
  image_url, image_detail_url, qr_code, rarity, collection_id
)
VALUES
  ('1', 'Masque Rituel Dogon', 'Artisan Dogon', 'XIVe siècle', 'Mali', 'Ce masque rituel dogon...', 'This Dogon ritual mask...', 'Ci mask Dogon bi...', '', '', '', '',
  'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg', 'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg', 'MCN001', 'legendary', '3'),
  ('2', 'Trône du Royaume Bamoun', 'Artisans du Palais Royal', 'XVIIIe siècle', 'Cameroun', 'Trône royal orné...', 'Royal throne adorned...', 'Ndey-ndey bu buur...', '', '', '', '',
  'https://images.pexels.com/photos/8728557/pexels-photo-8728557.jpeg', 'https://images.pexels.com/photos/8728557/pexels-photo-8728557.jpeg', 'MCN002', 'rare', '1'),
  ('3', 'Tambour Djembé Traditionnel', 'Maître artisan Mandingue', 'XVIIe siècle', 'Mali', 'Djembé cérémoniel...', 'Ceremonial djembe...', 'Djembé bu ceremoniel...', '', '', '', '',
  'https://images.pexels.com/photos/7520353/pexels-photo-7520353.jpeg', 'https://images.pexels.com/photos/7520353/pexels-photo-7520353.jpeg', 'MCN003', 'common', '4'),
  ('4', 'Masque Yoruba Gelede', 'Artisan Yoruba', 'XIXe siècle', 'Nigeria', 'Masque cérémoniel...', 'Ceremonial mask...', 'Mask Gelede bu ñuy...', '', '', '', '',
  'https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg', 'https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg', 'MCN004', 'rare', '3'),
  ('5', 'Statuette Bambara', 'Artisan Bambara', 'XIIIe siècle', 'Mali', 'Sculpture traditionnelle...', 'Traditional sculpture...', 'Statuette bu ñuy...', '', '', '', '',
  'https://images.pexels.com/photos/4706125/pexels-photo-4706125.jpeg', 'https://images.pexels.com/photos/4706125/pexels-photo-4706125.jpeg', 'MCN005', 'common', '2'),
  ('6', 'Couronne Royale Ashanti', 'Orfèvres du Royaume Ashanti', 'XVIe siècle', 'Ghana', 'Magnifique couronne...', 'Magnificent crown...', 'Ndey-ndey bu buur...', '', '', '', '',
  'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg', 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg', 'MCN006', 'legendary', '1')
ON CONFLICT (id) DO NOTHING;

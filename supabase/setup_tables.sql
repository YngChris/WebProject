-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT,
  includes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional - adjust based on your security needs)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for services table
-- Allow public read access
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete services
CREATE POLICY "Authenticated users can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for gallery table
-- Allow public read access
CREATE POLICY "Gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

-- Allow authenticated users to insert/delete gallery images
CREATE POLICY "Authenticated users can manage gallery" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert existing services from the hardcoded data
INSERT INTO services (title, description, full_description, duration, price, image, includes) VALUES
  ('Classic Manicure', 'A timeless treatment including shaping, cuticle care, and polish.', 'Our Classic Manicure is the perfect way to maintain healthy, beautiful nails. The treatment includes nail shaping and filing, cuticle care and moisturizing, a relaxing hand massage, and your choice of polish color from our extensive collection. Ideal for those who love a clean, polished look.', '45 mins', 'GH₵ 80', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.10%20AM.jpeg', ARRAY['Nail shaping & filing', 'Cuticle care', 'Hand massage', 'Polish of choice']),
  ('Gel Nails', 'Long-lasting gel polish that stays flawless for up to 3 weeks.', 'Our Gel Nails service uses premium gel polish that stays chip-free and glossy for up to 3 weeks. Perfect for busy people who want low-maintenance beautiful nails. The gel is cured under UV light for a hard, durable finish that won''t smudge or fade.', '60 mins', 'GH₵ 150', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.13%20AM.jpeg', ARRAY['Nail prep & shaping', 'Base coat', 'Gel color application', 'UV curing', 'Top coat']),
  ('Acrylic Extensions', 'Full set of acrylic nails customized to your desired length and shape.', 'Transform your nails with our Acrylic Extensions service. We apply a full set of acrylic nails customized to your desired length, shape, and style. Whether you want coffin, stiletto, almond, or square — we''ve got you covered. Great for adding strength and length to natural nails.', '90 mins', 'GH₵ 200', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.14%20AM.jpeg', ARRAY['Nail prep', 'Acrylic application', 'Shaping & filing', 'Polish or gel finish', 'Cuticle care']),
  ('Nail Art', 'Creative designs, patterns, and embellishments for a unique look.', 'Express your personality with our custom Nail Art service. From minimalist designs to bold statement nails, our skilled technicians bring your vision to life. We offer freehand art, stamping patterns, gradient/ombre effects, gems, and embellishments.', '30 mins+', 'GH₵ 50+', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.19.83%20AM.jpeg', ARRAY['Custom designs', 'Freehand art', 'Gems & embellishments', 'Stamping patterns', 'Gradient/ombre']),
  ('Pedicure', 'Relaxing foot soak, exfoliation, shaping, and polish application.', 'Treat your feet to our luxurious Pedicure service. We begin with a relaxing warm foot soak, followed by exfoliation to remove dead skin, nail shaping, cuticle care, and a moisturizing massage. Finished with your choice of polish for perfectly pampered feet.', '60 mins', 'GH₵ 100', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-06-04%20at%2011.39.14%20AM.jpeg', ARRAY['Foot soak', 'Exfoliation scrub', 'Nail shaping', 'Cuticle care', 'Polish of choice']),
  ('Spa Package', 'Full mani-pedi combo with scrub, massage, and premium polish.', 'The ultimate luxury nail experience. Our Spa Package combines a full manicure and pedicure with premium scrubs, extended massages, and your choice of gel or regular polish. Perfect for a self-care day or a special treat. This is the complete LuxeNails experience.', '120 mins', 'GH₵ 280', 'https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/service-page/WhatsApp%20Image%202026-96-04%20at%2011.19.13%20AM.jpeg', ARRAY['Full manicure', 'Full pedicure', 'Premium scrub', 'Extended massage', 'Gel or regular polish']);

-- Insert existing gallery images from the hardcoded data
INSERT INTO gallery (src, alt) VALUES
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.39.14%20AM.jpeg', 'Nail design 1'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.83%20AM.jpeg', 'Nail design 2'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.14%20AM.jpeg', 'Nail design 3'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.13%20AM.jpeg', 'Nail design 4'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.12%20AM.jpeg', 'Nail design 5'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.10%20AM.jpeg', 'Nail design 6'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.09%20AM.jpeg', 'Nail design 7'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/WhatsApp%20Image%202026-06-04%20at%2011.19.05%20AM.jpeg', 'Nail design 8'),
  ('https://pkbtkzzhnldtciedncna.supabase.co/storage/v1/object/public/gallery/Eyelash.jpeg', 'Nail design 9');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to gallery bucket
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery');

-- Policy to allow authenticated users to upload to gallery bucket
CREATE POLICY "Authenticated can upload to gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Policy to allow authenticated users to delete from gallery bucket
CREATE POLICY "Authenticated can delete from gallery"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');

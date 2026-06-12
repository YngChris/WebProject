-- Run in Supabase SQL Editor to update existing service prices to Ghanaian Cedis
UPDATE services SET price = 'GH₵ 80'  WHERE title = 'Classic Manicure';
UPDATE services SET price = 'GH₵ 150' WHERE title = 'Gel Nails';
UPDATE services SET price = 'GH₵ 200' WHERE title = 'Acrylic Extensions';
UPDATE services SET price = 'GH₵ 50+' WHERE title = 'Nail Art';
UPDATE services SET price = 'GH₵ 100' WHERE title = 'Pedicure';
UPDATE services SET price = 'GH₵ 280' WHERE title = 'Spa Package';

-- Convert any remaining dollar-formatted prices
UPDATE services
SET price = 'GH₵ ' || TRIM(BOTH FROM REPLACE(price, '$', ''))
WHERE price LIKE '$%';

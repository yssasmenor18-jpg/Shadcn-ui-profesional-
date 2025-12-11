-- Add category column to videos table
ALTER TABLE videos 
ADD COLUMN category text DEFAULT 'Todos';

-- Optional: Create an enum for categories if you want strict typing
-- CREATE TYPE video_category AS ENUM ('Todos', 'Naturaleza', 'Urbano', 'Tecnología', 'Arte', 'Música');
-- ALTER TABLE videos ALTER COLUMN category TYPE video_category USING category::video_category;

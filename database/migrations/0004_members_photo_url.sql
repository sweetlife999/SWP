-- Add photo_url to members for admin-managed profile photos.
ALTER TABLE members ADD COLUMN IF NOT EXISTS photo_url TEXT NOT NULL DEFAULT '';

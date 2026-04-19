DO $$
BEGIN
  CREATE TYPE "event_category" AS ENUM ('supper', 'wedding', 'birthday', 'play', 'weekend');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "category" "event_category" NOT NULL DEFAULT 'birthday';

-- Drop FK constraint linking events.host_id to users.id
ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_host_id_users_id_fk";

-- Drop NextAuth tables
DROP TABLE IF EXISTS "verification_tokens";
DROP TABLE IF EXISTS "sessions";
DROP TABLE IF EXISTS "accounts";
DROP TABLE IF EXISTS "users";

export const schema = `
CREATE TABLE IF NOT EXISTS routes (origin text NOT NULL, destination text NOT NULL, algorithm text NOT NULL, distance text NOT NULL, eta text NOT NULL, status text NOT NULL, PRIMARY KEY (origin, destination));
CREATE TABLE IF NOT EXISTS network_health (label text NOT NULL, title text PRIMARY KEY, body text NOT NULL, intent text NOT NULL);
CREATE TABLE IF NOT EXISTS nodes (id text PRIMARY KEY, name text NOT NULL, coordinates text NOT NULL, connections text NOT NULL, state text NOT NULL);
CREATE TABLE IF NOT EXISTS templates (title text PRIMARY KEY, body text NOT NULL, meta text NOT NULL);
CREATE TABLE IF NOT EXISTS benchmarks (algorithm text PRIMARY KEY, detail text NOT NULL, median text NOT NULL, accuracy text NOT NULL, status text NOT NULL);
CREATE TABLE IF NOT EXISTS tutorials (title text PRIMARY KEY, lesson text NOT NULL, duration text NOT NULL, description text NOT NULL, icon text NOT NULL, image text NOT NULL);
CREATE TABLE IF NOT EXISTS app_user (id boolean PRIMARY KEY DEFAULT true CHECK (id), name text NOT NULL, role text NOT NULL, avatar text NOT NULL);

CREATE OR REPLACE FUNCTION notify_stans_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('stans_changes', TG_TABLE_NAME);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['routes', 'network_health', 'nodes', 'templates', 'benchmarks', 'tutorials', 'app_user'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS stans_change_trigger ON %I', table_name);
    EXECUTE format('CREATE TRIGGER stans_change_trigger AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION notify_stans_change()', table_name);
  END LOOP;
END $$;
`;

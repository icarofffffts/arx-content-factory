CREATE USER evolution_user WITH PASSWORD 'evo_simple_pass_2026';
GRANT ALL PRIVILEGES ON DATABASE evolution_db TO evolution_user;
GRANT ALL ON SCHEMA evolution_api TO evolution_user;

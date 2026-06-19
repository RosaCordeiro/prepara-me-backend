-- Usuário e database padrão do Prepara-me (WSL)
-- Uso: psql -h localhost -U postgres -f scripts/create-database.sql

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'docker') THEN
        CREATE ROLE docker LOGIN PASSWORD 'admin@01';
    ELSE
        ALTER ROLE docker WITH LOGIN PASSWORD 'admin@01';
    END IF;
END
$$;

SELECT 'CREATE DATABASE preparame OWNER docker'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'preparame')
\gexec

GRANT ALL PRIVILEGES ON DATABASE preparame TO docker;

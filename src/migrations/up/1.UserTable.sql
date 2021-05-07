START TRANSACTION;
    CREATE TABLE "user" (
        id serial PRIMARY KEY,
        first_name varchar NOT NULL,
        last_name varchar NOT NULL,
        is_active boolean NOT NULL
    );
COMMIT;
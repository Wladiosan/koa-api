START TRANSACTION;
    CREATE TABLE "user" (
        id serial PRIMARY KEY,
        email CHARACTER VARYING NOT NULL,
        first_name varchar NOT NULL,
        last_name varchar NOT NULL,
        password CHARACTER VARYING NOT NULL,
        is_active boolean NOT NULL
    );
COMMIT;
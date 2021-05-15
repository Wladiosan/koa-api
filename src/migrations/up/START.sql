START TRANSACTION;

    CREATE TABLE "users" (
        id serial PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        username VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        is_admin bool default false,
        category VARCHAR DEFAULT 'Junior',
        gender VARCHAR DEFAULT 'Select',
        photo VARCHAR,
        country VARCHAR DEFAULT 'Ukraine',
        stack VARCHAR DEFAULT 'Select',,
        phone VARCHAR DEFAULT '+380',
        rate VARCHAR
    );

    ALTER TABLE "users" ADD CONSTRAINT users_email UNIQUE (email);
    ALTER TABLE "users" ADD CONSTRAINT users_username UNIQUE (username);

COMMIT;

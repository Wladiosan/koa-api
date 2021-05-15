START TRANSACTION;

    ALTER TABLE "users" DROP COLUMN rate;
    ALTER TABLE "users" DROP COLUMN phone;
    ALTER TABLE "users" DROP COLUMN stack;
    ALTER TABLE "users" DROP COLUMN country;
    ALTER TABLE "users" DROP COLUMN photo;
    ALTER TABLE "users" DROP COLUMN gender;

    ALTER TABLE "users" DROP CONSTRAINT fk_category;
    ALTER TABLE "users" DROP COLUMN category_id;

    ALTER TABLE "category" DROP CONSTRAINT category_name;

    ALTER TABLE "users" DROP CONSTRAINT users_username;
    ALTER TABLE "users" DROP CONSTRAINT user_email;

    DROP TABLE "category";
    DROP TABLE "users";

COMMIT;

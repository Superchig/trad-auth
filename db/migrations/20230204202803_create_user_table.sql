-- migrate:up
CREATE TABLE user_account (
  id SERIAL PRIMARY KEY,
  username varchar(255),
  email varchar(255) NOT NULL,
  password varchar(255)
);

-- migrate:down
DROP TABLE user_account;

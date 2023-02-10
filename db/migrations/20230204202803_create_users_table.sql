-- migrate:up
CREATE TABLE users (
  id SERIAL,
  username varchar(255),
  email varchar(255) NOT NULL,
  password varchar(255)
);

-- migrate:down
DROP TABLE users;

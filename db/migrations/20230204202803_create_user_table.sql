-- migrate:up
CREATE TABLE user_account (
  id SERIAL PRIMARY KEY,
  username varchar(255),
  email varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  password varchar(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_user_account
BEFORE UPDATE ON user_account
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- migrate:down
DROP TRIGGER set_timestamp_user_account on user_account;

DROP TABLE user_account;

DROP FUNCTION trigger_set_timestamp;

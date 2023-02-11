-- migrate:up
CREATE TABLE user_session (
  id uuid PRIMARY KEY,
  user_account_id integer REFERENCES user_account(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_user_session
BEFORE UPDATE ON user_session
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- migrate:down
DROP TABLE user_session;

DROP TRIGGER set_timestamp_user_session;

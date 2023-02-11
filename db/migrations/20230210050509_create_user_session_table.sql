-- migrate:up
CREATE TABLE user_session (
  id uuid,
  user_account_id integer REFERENCES user_account(id)
);

-- migrate:down
DROP TABLE user_session;

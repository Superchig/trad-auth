-- migrate:up
CREATE TABLE account (
  id INTEGER PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_account
BEFORE UPDATE ON account
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- FIXME(Chris): Add timestamps to other new tables

-- https://dirtsimple.org/2010/11/simplest-way-to-do-tree-based-queries.html
CREATE TABLE account_closure (
  ancestor_id INTEGER,
  descendant_id INTEGER,
  depth INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ancestor_id, descendant_id),
  FOREIGN KEY (ancestor_id) REFERENCES account(id),
  FOREIGN KEY (descendant_id) REFERENCES account(id)
);

CREATE TRIGGER set_timestamp_account_closure
BEFORE UPDATE ON account_closure
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE financial_transaction (
  id INTEGER PRIMARY KEY,
  date TEXT,
  description TEXT,
  priority INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_financial_transaction
BEFORE UPDATE ON financial_transaction
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Represents a debit or a credit
CREATE TABLE debit_credit (
  id INTEGER PRIMARY KEY,
  amount INTEGER,
  transaction_id INTEGER,
  account_id INTEGER,
  priority INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (transaction_id) REFERENCES financial_transaction(id),
  FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TRIGGER set_timestamp_debit_credit
BEFORE UPDATE ON debit_credit
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Triggers

-- FIXME(Chris): Port these triggers over

CREATE OR REPLACE FUNCTION trigger_account_insert()
RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO account_closure (ancestor_id, descendant_id, depth)
        VALUES (NEW.id, NEW.id, 0);
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER account_insert_zero_depth
AFTER INSERT ON account
FOR EACH ROW
EXECUTE FUNCTION trigger_account_insert();

CREATE OR REPLACE FUNCTION trigger_account_delete()
    RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM account_closure
    WHERE ancestor_id = OLD.id AND descendant_id = OLD.id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER account_delete_zero_depth
BEFORE DELETE on account
FOR EACH ROW
EXECUTE FUNCTION trigger_account_delete();

-- Create view - Represent all of the debit/credits for a transaction,
-- with associated information on the relevant accounts and transactions

CREATE VIEW full_transaction_view AS
SELECT financial_transaction.id AS transaction_id,
       financial_transaction.description AS transaction_description,
       financial_transaction.date AS transaction_date,
       debit_credit.id AS debit_credit_id,
       debit_credit.amount AS debit_credit_amount,
       debit_credit.account_id
FROM financial_transaction
         INNER JOIN debit_credit on financial_transaction.id = debit_credit.transaction_id
         INNER JOIN account on debit_credit.account_id = account.id;

-- Indexes on commonly-queried attributes

CREATE INDEX financial_transaction_date_idx
    ON financial_transaction(date);

-- Indexes on foreign keys

CREATE INDEX debit_credit_financial_transaction_idx
    ON debit_credit(transaction_id);

CREATE INDEX debit_credit_account_idx
    ON debit_credit(account_id);

CREATE INDEX account_closure_ancestor_idx
    ON account_closure(ancestor_id);

CREATE INDEX account_closure_descendant_idx
    ON account_closure(descendant_id);

-- migrate:down
DROP INDEX account_closure_descendant_idx;
DROP INDEX account_closure_ancestor_idx;
DROP INDEX debit_credit_account_idx;
DROP INDEX debit_credit_financial_transaction_idx;
DROP INDEX financial_transaction_date_idx;

DROP VIEW full_transaction_view;

DROP TRIGGER account_delete_zero_depth ON account;
DROP FUNCTION trigger_account_delete;

DROP TRIGGER account_insert_zero_depth ON account;
DROP FUNCTION trigger_account_insert;

DROP TRIGGER set_timestamp_debit_credit ON debit_credit;
DROP TABLE debit_credit;
DROP TRIGGER set_timestamp_financial_transaction ON financial_transaction;
DROP TABLE financial_transaction;
DROP TRIGGER set_timestamp_account_closure ON account_closure;
DROP TABLE account_closure;

DROP TRIGGER set_timestamp_account ON account;
DROP TABLE account;

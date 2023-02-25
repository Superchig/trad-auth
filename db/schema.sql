SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_account_delete(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_account_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM account_closure
    WHERE ancestor_id = OLD.id AND descendant_id = OLD.id;
END;
$$;


--
-- Name: trigger_account_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_account_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO account_closure (ancestor_id, descendant_id, depth)
        VALUES (NEW.id, NEW.id, 0);
    END;
$$;


--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id integer NOT NULL,
    name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: account_closure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_closure (
    ancestor_id integer NOT NULL,
    descendant_id integer NOT NULL,
    depth integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: debit_credit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debit_credit (
    id integer NOT NULL,
    amount integer,
    transaction_id integer,
    account_id integer,
    priority integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: financial_transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.financial_transaction (
    id integer NOT NULL,
    date text,
    description text,
    priority integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: full_transaction_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.full_transaction_view AS
 SELECT financial_transaction.id AS transaction_id,
    financial_transaction.description AS transaction_description,
    financial_transaction.date AS transaction_date,
    debit_credit.id AS debit_credit_id,
    debit_credit.amount AS debit_credit_amount,
    debit_credit.account_id
   FROM ((public.financial_transaction
     JOIN public.debit_credit ON ((financial_transaction.id = debit_credit.transaction_id)))
     JOIN public.account ON ((debit_credit.account_id = account.id)));


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: user_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_account (
    id integer NOT NULL,
    username character varying(255),
    email character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    password character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_account_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_account_id_seq OWNED BY public.user_account.id;


--
-- Name: user_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_session (
    id uuid NOT NULL,
    user_account_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_account id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account ALTER COLUMN id SET DEFAULT nextval('public.user_account_id_seq'::regclass);


--
-- Name: account_closure account_closure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_closure
    ADD CONSTRAINT account_closure_pkey PRIMARY KEY (ancestor_id, descendant_id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: debit_credit debit_credit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debit_credit
    ADD CONSTRAINT debit_credit_pkey PRIMARY KEY (id);


--
-- Name: financial_transaction financial_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.financial_transaction
    ADD CONSTRAINT financial_transaction_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (id);


--
-- Name: user_session user_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_pkey PRIMARY KEY (id);


--
-- Name: account_closure_ancestor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_closure_ancestor_idx ON public.account_closure USING btree (ancestor_id);


--
-- Name: account_closure_descendant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_closure_descendant_idx ON public.account_closure USING btree (descendant_id);


--
-- Name: debit_credit_account_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX debit_credit_account_idx ON public.debit_credit USING btree (account_id);


--
-- Name: debit_credit_financial_transaction_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX debit_credit_financial_transaction_idx ON public.debit_credit USING btree (transaction_id);


--
-- Name: financial_transaction_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX financial_transaction_date_idx ON public.financial_transaction USING btree (date);


--
-- Name: account account_delete_zero_depth; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER account_delete_zero_depth BEFORE DELETE ON public.account FOR EACH ROW EXECUTE FUNCTION public.trigger_account_delete();


--
-- Name: account account_insert_zero_depth; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER account_insert_zero_depth AFTER INSERT ON public.account FOR EACH ROW EXECUTE FUNCTION public.trigger_account_insert();


--
-- Name: account set_timestamp_account; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_account BEFORE UPDATE ON public.account FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: account_closure set_timestamp_account_closure; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_account_closure BEFORE UPDATE ON public.account_closure FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: debit_credit set_timestamp_debit_credit; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_debit_credit BEFORE UPDATE ON public.debit_credit FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: financial_transaction set_timestamp_financial_transaction; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_financial_transaction BEFORE UPDATE ON public.financial_transaction FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: user_account set_timestamp_user_account; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_user_account BEFORE UPDATE ON public.user_account FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: user_session set_timestamp_user_session; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_user_session BEFORE UPDATE ON public.user_session FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: account_closure account_closure_ancestor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_closure
    ADD CONSTRAINT account_closure_ancestor_id_fkey FOREIGN KEY (ancestor_id) REFERENCES public.account(id);


--
-- Name: account_closure account_closure_descendant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_closure
    ADD CONSTRAINT account_closure_descendant_id_fkey FOREIGN KEY (descendant_id) REFERENCES public.account(id);


--
-- Name: debit_credit debit_credit_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debit_credit
    ADD CONSTRAINT debit_credit_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- Name: debit_credit debit_credit_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debit_credit
    ADD CONSTRAINT debit_credit_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.financial_transaction(id);


--
-- Name: user_session user_session_user_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_user_account_id_fkey FOREIGN KEY (user_account_id) REFERENCES public.user_account(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20230204202803'),
    ('20230210050509'),
    ('20230225132228');

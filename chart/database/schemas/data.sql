CREATE TABLE if not exists currency(
    from_currency TEXT NOT NULL,
    conv_currency TEXT NOT NULL,
    rate NUMERIC(30) NOT NULL,
    date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS currency_from_currency_conv_currency_idx
    ON public.currency USING btree
    (from_currency COLLATE pg_catalog."default" ASC NULLS LAST, conv_currency COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=True)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS currency_date_idx
    ON public.currency USING btree
    (date ASC NULLS LAST)
    WITH (deduplicate_items=True)
    TABLESPACE pg_default;
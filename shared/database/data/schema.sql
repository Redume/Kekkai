CREATE TABLE IF NOT EXISTS currency(
    from_currency TEXT NOT NULL,
    conv_currency TEXT NOT NULL,
    rate FLOAT NOT NULL,
    date DATE NOT NULL
);
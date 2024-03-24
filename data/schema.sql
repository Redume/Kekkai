CREATE TABLE fiat(
    from_currency TEXT NOT NULL,
    conv_currency TEXT NOT NULL,
    rate FLOAT NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE crypto(
    from_currency TEXT NOT NULL,
    conv_currency TEXT NOT NULL,
    rate FLOAT NOT NULL,
    date DATE NOT NULL
);
package su.redume.core.network.api

import su.redume.core.network.model.CurrencyDto

interface FiatCurrencyServer {
    suspend fun currency(value: String, pair: String): List<CurrencyDto>
}
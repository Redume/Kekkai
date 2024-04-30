package su.redume.core.network.impl

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import su.redume.core.network.api.FiatCurrencyServer
import su.redume.core.network.model.CurrencyDto
import su.redume.utils.js

class FiatCurrencyServerImpl : FiatCurrencyServer {
    private val httpClient = HttpClient {
        install(ContentNegotiation) {
            js()
            json(
                Json {
                    ignoreUnknownKeys = true
                }
            )
        }
        defaultRequest {
            contentType(ContentType.Application.Json)
            url("https://duckduckgo.com/js/spice/currency/1/")
        }
    }

    override suspend fun currency(value: String, pair: String): List<CurrencyDto> = httpClient.get("$value/$pair").body()
}
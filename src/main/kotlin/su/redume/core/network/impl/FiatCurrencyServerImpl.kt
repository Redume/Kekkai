package su.redume.core.network.impl

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import javax.inject.Inject
import su.redume.core.network.api.FiatCurrencyServer
import su.redume.core.network.model.CurrencyDto

class FiatCurrencyServerImpl @Inject constructor() : FiatCurrencyServer {
    private val httpClient = HttpClient {
        install(ContentNegotiation) {
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
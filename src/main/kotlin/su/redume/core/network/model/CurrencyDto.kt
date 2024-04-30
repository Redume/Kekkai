package su.redume.core.network.model

import kotlinx.serialization.Serializable

@Serializable
data class CurrencyDto(
    val from: String,
    val timestamp: Long,
    val quetocurrency: String,
    val mid: Float
)
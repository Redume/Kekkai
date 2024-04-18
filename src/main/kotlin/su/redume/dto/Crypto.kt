package su.redume.dto

import kotlinx.serialization.Serializable

@Serializable
data class Crypto(val fromCurrency: String, val convCurrency: String, val rate: Float, val date: String)
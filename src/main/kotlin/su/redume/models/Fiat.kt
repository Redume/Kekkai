package su.redume.models

import org.jetbrains.exposed.sql.Table

object Fiat : Table() {
    val fromCurrecny = varchar("fromCurrecny", 3)
    val convCurrency = varchar("convCurrency", 3)
    val rate = float("rate")
    val date = long("date")
}
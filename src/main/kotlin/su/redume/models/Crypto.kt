package su.redume.models

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.stringParam

object Crypto : Table() {
    val fromCurrecny = stringParam("fromCurrecny")
    val convCurrency = stringParam("convCurrency")
    val rate = float("rate")
    val date = long("date")
}
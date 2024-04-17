package su.redume.models

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.stringParam

object Fiat : Table() {
    val fromCurrecny = stringParam("fromCurrecny")
    val convCurrency = stringParam("convCurrency")
    val rate = integer("rate")
    val date = long("date")
}
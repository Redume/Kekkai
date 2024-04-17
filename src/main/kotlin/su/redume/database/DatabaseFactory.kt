package su.redume.database

import io.ktor.server.config.*
import org.jetbrains.exposed.sql.Database
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import su.redume.models.Crypto
import su.redume.models.Fiat

object DatabaseFactory {
    fun init(config: ApplicationConfig) {
        val jdbcURL = config.property("ktor.database.jdbcURL").getString()
        val maxPoolSize = config.property("ktor.database.maxPoolSize").getString()
        val autoCommit = config.property("ktor.database.autoCommit").getString()
        val username = config.property("ktor.database.user").getString()
        val password = config.property("ktor.database.password").getString()
        val defaultDatabase = config.property("ktor.database.database").getString()

        val connectPool = createHikariDataSource(
            url = "$jdbcURL/$defaultDatabase?user=$username&password=$password",
            maxPoolSize.toInt(),
            autoCommit.toBoolean()
        )

        val database = Database.connect(connectPool)
        transaction(database) {
            SchemaUtils.create(Fiat)
            SchemaUtils.create(Crypto)
        }
    }


private fun createHikariDataSource(
    url: String,
    maxPoolSize: Int,
    autoCommit: Boolean
) = HikariDataSource(HikariConfig().apply {
    driverClassName = "org.postgresql.Driver"
    jdbcUrl = url
    maximumPoolSize = maxPoolSize
    isAutoCommit = autoCommit
    transactionIsolation = "TRANSACTION_REPEATABLE_READ"
    validate()
})

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

}
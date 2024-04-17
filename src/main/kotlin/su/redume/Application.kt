package su.redume

import io.ktor.server.application.*
import su.redume.database.DatabaseFactory
import su.redume.plugins.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    DatabaseFactory.init(environment.config)
    configureRouting(environment.config)
}
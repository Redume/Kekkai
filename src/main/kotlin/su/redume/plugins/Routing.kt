package su.redume.plugins

import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting(config: ApplicationConfig) {
    routing {
        get("/") {
            call.respondText("Hello World!")
        }
    }
}

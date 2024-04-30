package su.redume.utils

import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.util.reflect.*
import io.ktor.utils.io.*
import io.ktor.utils.io.charsets.*
import io.ktor.utils.io.jvm.javaio.*
import kotlinx.serialization.InternalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer

class JsConverter : ContentConverter {

    @OptIn(InternalSerializationApi::class)
    override suspend fun deserialize(
        charset: Charset,
        typeInfo: TypeInfo,
        content: ByteReadChannel
    ): Any {
        val rawJs = content.toInputStream().reader(charset).readText()
        val json = rawJs
            .replace("[a-z_0-9]+\\(".toRegex(), "")
            .replace(");", "")
        val serializer = typeInfo.type.serializer()
        val jsonSerializer = Json {
            ignoreUnknownKeys = true
        }
        return jsonSerializer.decodeFromString(serializer, json)
    }

}

fun Configuration.js() {
    val converter = JsConverter()
    register(ContentType.Application.JavaScript, converter)
}

const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } =
require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//Instrumentations
const { ExpressInstrumentation } =
require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
//Exporter

const {
    JaegerExporter,
  } = require("@opentelemetry/exporter-jaeger");
module.exports = (serviceName) => {
const exporter = new JaegerExporter({
    // optional - default url is http://localhost:4318/v1/traces
   // url: "<your-otlp-endpoint>/v1/traces",
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  });


const provider = new NodeTracerProvider({
resource: new Resource({
[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
}),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
registerInstrumentations({
instrumentations: [
new HttpInstrumentation(),
new ExpressInstrumentation(),
new MongoDBInstrumentation(),
],
tracerProvider: provider,
});
return trace.getTracer(serviceName);
};
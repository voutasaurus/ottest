package main

import (
	"context"
	"io"
	"net/http"

	opentracing "github.com/opentracing/opentracing-go"
	jaeger "github.com/uber/jaeger-client-go"
	config "github.com/uber/jaeger-client-go/config"
)

func startSpan(ctx context.Context, name string) (context.Context, opentracing.Span) {
	sp, ctx := opentracing.StartSpanFromContext(ctx, name)
	return ctx, sp
}

func traces(agent, service string) error {
	tracer, closer, err := initJaeger(agent, service)
	if err != nil {
		return err
	}
	opentracing.SetGlobalTracer(tracer)
	// TODO: add closer to server graceful shutdown mechanism
	_ = closer
	return nil
}

// initJaeger returns an instance of Jaeger Tracer that samples 100% of traces and logs all spans to stdout.
func initJaeger(agent, service string) (opentracing.Tracer, io.Closer, error) {
	cfg := &config.Configuration{
		Sampler: &config.SamplerConfig{
			Type:  "const",
			Param: 1,
		},
		Reporter: &config.ReporterConfig{
			LogSpans:           true,
			LocalAgentHostPort: agent,
		},
	}
	tracer, closer, err := cfg.New(service, config.Logger(jaeger.StdLogger))
	if err != nil {
		return nil, nil, err
	}
	return tracer, closer, nil
}

func withTrace(ctx context.Context, req *http.Request) *http.Request {
	span := opentracing.SpanFromContext(ctx)
	if span == nil {
		// no span to transmit
		return req.WithContext(ctx)
	}
	opentracing.GlobalTracer().Inject(
		span.Context(),
		opentracing.HTTPHeaders,
		opentracing.HTTPHeadersCarrier(req.Header),
	)
	return req.WithContext(ctx)
}

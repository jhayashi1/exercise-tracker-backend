resource "aws_apigatewayv2_api" "api" {
  name          = "exercise-tracker-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["*"]
    allow_methods = ["GET", "POST"]
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_authorizer" "authorizer" {
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "exercise-tracker-authorizer"

  jwt_configuration {
    audience = ["todo"]
    issuer   = "todo"
  }
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  auto_deploy = true
  name        = "exercise-tracker-stage"
}

resource "aws_apigatewayv2_domain_name" "domain" {
  domain_name = "api.jhayashi.com"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api_cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_integration" "todo" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_method     = "GET"
  integration_type       = "AWS_PROXY"
  integration_uri        = "invoke_arn"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "todo_route" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /todo/route"
  target             = "integrations/${aws_apigatewayv2_integration.todo.id}"
}

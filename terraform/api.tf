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
    audience = [aws_cognito_user_pool_client.user_pool_client.id]
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.user_pool.id}"
  }
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  auto_deploy = true
  name        = "exercise-tracker-stage"
}

resource "aws_apigatewayv2_domain_name" "domain" {
  domain_name = "api.jaredhayashi.com"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api_cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "mapping" {
  api_id      = aws_apigatewayv2_api.api.id
  domain_name = aws_apigatewayv2_domain_name.domain.id
  stage       = aws_apigatewayv2_stage.stage.id
}

### Session API endpoints ###

resource "aws_apigatewayv2_integration" "session" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_method     = "POST"
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.session.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "session_get" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /session/session"
  target             = "integrations/${aws_apigatewayv2_integration.session.id}"
}

resource "aws_apigatewayv2_route" "session_list" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /session/list"
  target             = "integrations/${aws_apigatewayv2_integration.session.id}"
}

resource "aws_apigatewayv2_route" "session_overview" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /session/overview"
  target             = "integrations/${aws_apigatewayv2_integration.session.id}"
}

resource "aws_apigatewayv2_route" "session_start" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "POST /session/start"
  target             = "integrations/${aws_apigatewayv2_integration.session.id}"
}

resource "aws_apigatewayv2_route" "session_stop" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "POST /session/stop"
  target             = "integrations/${aws_apigatewayv2_integration.session.id}"
}

### Friend API endpoints ###

resource "aws_apigatewayv2_integration" "friend" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_method     = "POST"
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.friend.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "list_friends" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /friend/list"
  target             = "integrations/${aws_apigatewayv2_integration.friend.id}"
}

resource "aws_apigatewayv2_route" "list_friend_requests" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "GET /friend/list-requests"
  target             = "integrations/${aws_apigatewayv2_integration.friend.id}"
}

resource "aws_apigatewayv2_route" "friend_request" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "POST /friend/request"
  target             = "integrations/${aws_apigatewayv2_integration.friend.id}"
}

resource "aws_apigatewayv2_route" "friend_request_action" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "POST /friend/request-action"
  target             = "integrations/${aws_apigatewayv2_integration.friend.id}"
}

resource "aws_apigatewayv2_route" "friend_remove" {
  api_id             = aws_apigatewayv2_api.api.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.authorizer.id
  route_key          = "POST /friend/remove"
  target             = "integrations/${aws_apigatewayv2_integration.friend.id}"
}

resource "aws_lambda_permission" "api_can_invoke_session_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:${aws_apigatewayv2_api.api.id}*"
}

resource "aws_lambda_function" "session" {
  function_name = "exercise-tracker-session"
  handler       = "index.handler"

  memory_size = "256"
  timeout     = "5"
  runtime     = "nodejs22.x"
  role        = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/cloudfront-kill-switch-role"

  filename         = "session.zip"
  source_code_hash = filebase64sha256("session.zip")

  environment {
    variables = {
      COGNITO_POOL_ID = aws_cognito_user_pool.user_pool.id
    }
  }

  # tracing_config {
  #   mode = "Active"
  # }

  # vpc_config {
  #   security_group_ids = []
  #   subnet_ids = []
  # }
}

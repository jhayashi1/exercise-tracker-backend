resource "aws_lambda_permission" "api_can_invoke_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:${aws_apigatewayv2_api.api.id}*"
}

resource "aws_lambda_function" "todo" {
  function_name = "todo"
  handler       = "index.handler"

  memory_size = "512"
  timeout     = "5"
  runtime     = "nodejs22.x"
  role        = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/cloudfront-kill-switch-role"

  filename         = "todo.zip"
  source_code_hash = filebase64sha256("todo.zip")

  # environment {
  #   variables = {

  #   }
  # }

  # tracing_config {
  #   mode = "Active"
  # }

  # vpc_config {
  #   security_group_ids = []
  #   subnet_ids = []
  # }
}

resource "aws_lambda_permission" "api_can_invoke_sessions_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sessions.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:${aws_apigatewayv2_api.api.id}*"
}

resource "aws_lambda_function" "sessions" {
  function_name = "exercise-tracker-sessions"
  handler       = "index.handler"

  memory_size = "256"
  timeout     = "5"
  runtime     = "nodejs22.x"
  role        = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/cloudfront-kill-switch-role"

  filename         = "sessions.zip"
  source_code_hash = filebase64sha256("sessions.zip")

  # environment {
  #   variables = {

  #   }
  # }

  # tracing_config {
  #   mode = "Active"
  # }

  # vpc_config {
  #   security_group_ids = []
  #   subnet_ids = []
  # }
}

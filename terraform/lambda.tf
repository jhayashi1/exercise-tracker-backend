resource "aws_lambda_function" "todo" {
  function_name = "todo"
  handler       = "index.handler"

  memory_size = "512"
  timeout     = "5"
  runtime     = "nodejs22.x"
  role        = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/EC2-S3-Access"

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

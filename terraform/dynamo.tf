resource "aws_dynamodb_table" "exercise_sessions" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "exercise-tracker-sessions"
  hash_key     = "username"
  range_key    = "guid"

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "guid"
    type = "S"
  }

  attribute {
    name = "endTimestamp"
    type = "S"
  }

  global_secondary_index {
    name            = "username-timestamp-index"
    hash_key        = "username"
    range_key       = "endTimestamp"
    projection_type = "ALL"
  }
}

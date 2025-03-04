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
    name = "stopTimestamp"
    type = "S"
  }

  global_secondary_index {
    name            = "username-timestamp-index"
    hash_key        = "username"
    range_key       = "stopTimestamp"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "friends" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "exercise-tracker-friends"
  hash_key     = "username"
  range_key    = "friendUsername"

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "friendUsername"
    type = "S"
  }

  global_secondary_index {
    name            = "friend-username-index"
    hash_key        = "friendUsername"
    range_key       = "username"
    projection_type = "ALL"
  }
}


resource "aws_dynamodb_table" "friend_requests" {
  billing_mode = "PAY_PER_REQUEST"
  name         = "exercise-tracker-friend-requests"
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
    name = "friendUsername"
    type = "S"
  }

  global_secondary_index {
    name            = "friend-username-index"
    hash_key        = "friendUsername"
    range_key       = "username"
    projection_type = "ALL"
  }
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "exercise-tracker-user-pool"
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "exercise-tracker-user-pool-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  callback_urls                        = ["http://localhost:8080/callback", "http://localhost:8080"]
  logout_urls                          = ["http://localhost:8080/logout"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "user_pool_domain" {
  domain       = "exercise-tracker-domain"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

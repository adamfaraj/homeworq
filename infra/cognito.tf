resource "aws_cognito_user_pool" "main" {
  name = "home-maintenance-user-pool"

  auto_verified_attributes = ["email"]

  schema {
    name     = "email"
    required = true
    mutable  = true
    attribute_data_type = "String"
    string_attribute_constraints {
      min_length = 5
      max_length = 256
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}


resource "aws_cognito_user_pool_client" "app" {
  name         = "home-maintenance-app-client"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false

  allowed_oauth_flows       = ["code"]
  allowed_oauth_scopes      = ["email", "openid", "profile"]
  supported_identity_providers = ["COGNITO", "Google", "Facebook", "SignInWithApple"]

  callback_urls = [
    "https://localhost:3000/callback",
    "https://home-worq.com/callback"
  ]

  logout_urls = [
    "https://localhost:3000/logout",
    "https://home-worq.com/logout"
  ]

  allowed_oauth_flows_user_pool_client = true
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id     = var.google_client_id
    client_secret = var.google_client_secret
    authorize_scopes = "openid email profile"
  }

  attribute_mapping = {
    email = "email"
  }
}

# resource "aws_cognito_identity_provider" "facebook" {
#   user_pool_id  = aws_cognito_user_pool.main.id
#   provider_name = "Facebook"
#   provider_type = "Facebook"

#   provider_details = {
#     client_id     = var.facebook_app_id
#     client_secret = var.facebook_app_secret
#     authorize_scopes = "email public_profile"
#   }

#   attribute_mapping = {
#     email = "email"
#   }
# }

# resource "aws_cognito_identity_provider" "apple" {
#   user_pool_id  = aws_cognito_user_pool.main.id
#   provider_name = "SignInWithApple"
#   provider_type = "SignInWithApple"

#   provider_details = {
#     client_id     = var.apple_services_id
#     team_id       = var.apple_team_id
#     key_id        = var.apple_key_id
#     private_key   = var.apple_private_key
#   }

#   attribute_mapping = {
#     email = "email"
#   }
# }

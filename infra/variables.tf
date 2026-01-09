variable "db_username" {
  description = "The RDS database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The RDS database password"
  type        = string
  sensitive   = true
}

variable "github_oauth_token" {
  type      = string
  sensitive = true
}


variable "google_client_id" {}
variable "google_client_secret" {}
# variable "facebook_app_id" {}
# variable "facebook_app_secret" {}
# variable "apple_services_id" {}
# variable "apple_team_id" {}
# variable "apple_key_id" {}
# variable "apple_private_key" {}

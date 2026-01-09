resource "aws_amplify_app" "frontend" {
  name = "home-worq-app"
  repository = "https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME"
  oauth_token = var.github_oauth_token # Store in GitHub or Terraform Cloud secrets
  platform = "WEB"

  build_spec = file("${path.module}/amplify-buildspec.yml") # Optional custom buildspec

  environment_variables = {
    ENVIRONMENT = "production"
  }
}

resource "aws_amplify_branch" "main" {
  app_id = aws_amplify_app.frontend.id
  branch_name = "main"
  stage = "PRODUCTION"
  framework = "React"
  enable_auto_build = true
}

resource "aws_amplify_domain_association" "custom_domain" {
  app_id      = aws_amplify_app.frontend.id
  domain_name = "home-worq.com"

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "" # root domain
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}

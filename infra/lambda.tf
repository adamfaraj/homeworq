resource "aws_iam_role" "lambda_exec_role" {
  name = "go_lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Upload Go binary .zip file to S3 (if preferred over local)
resource "aws_s3_object" "lambda_zip" {
  bucket = "your-code-bucket"
  key    = "backend/main.zip"
  source = "build/main.zip"
  etag   = filemd5("build/main.zip")
}

resource "aws_lambda_function" "go_backend" {
  function_name = "go-backend-handler"
  handler       = "main"
  runtime       = "go1.x"
  role          = aws_iam_role.lambda_exec_role.arn

  filename         = "build/main.zip"
  source_code_hash = filebase64sha256("build/main.zip")

  timeout      = 10
  memory_size  = 128

  environment {
    variables = {
      ENV     = "production"
      DB_DSN  = jsondecode(data.aws_secretsmanager_secret_version.db_creds.secret_string).dsn
    }
  }
}

data "aws_secretsmanager_secret" "db_creds" {
  name = "rds-db-dsn"
}

data "aws_secretsmanager_secret_version" "db_creds" {
  secret_id = data.aws_secretsmanager_secret.db_creds.id
}


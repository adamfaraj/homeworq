resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "user-db-subnet-group"
  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]

  tags = {
    Name = "UserDBSubnetGroup"
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "user-db-subnet-group"
  subnet_ids = ["subnet-abc123", "subnet-def456"] # Replace with your real subnet IDs

  tags = {
    Name = "UserDBSubnetGroup"
  }
}

resource "aws_db_instance" "user_db" {
  identifier              = "user-db-hw-instance"
  engine                  = "postgres"
  engine_version          = "15.3"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  max_allocated_storage   = 100
  db_name                 = "userdb-hw"
  username                = jsondecode(aws_secretsmanager_secret_version.db_credentials_value.secret_string)["username"]
  password                = jsondecode(aws_secretsmanager_secret_version.db_credentials_value.secret_string)["password"]
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  skip_final_snapshot     = true
  publicly_accessible     = false
  backup_retention_period = 7

  tags = {
    Name = "UserDatabaseHw"
  }
}

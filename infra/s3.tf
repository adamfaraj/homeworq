resource "aws_s3_bucket" "maintenance_rules_bucket" {
  bucket = "maintenance-rules"
}

resource "aws_s3_bucket_object" "maintenance_rules" {
  bucket = aws_s3_bucket.maintenance_rules_bucket.id
  key    = "maintenance-rules.json"
  source = "./files/maintenance-rules.json"
}
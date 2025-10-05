# CloudWatch Logs Interface Endpoint
resource "aws_vpc_endpoint" "logs" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.${var.aws_region}.logs"
  vpc_endpoint_type = "Interface"
  subnet_ids        = module.vpc.private_subnets
  security_group_ids = [aws_security_group.letschat_sg.id]
  private_dns_enabled = true
  region = var.aws_region

  tags = {
    Name = "letschat-cloudwatch-logs-endpoint"
  }
}

# ECR API Interface Endpoint
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids        = module.vpc.private_subnets
  security_group_ids = [aws_security_group.letschat_sg.id]
  private_dns_enabled = true
  region = var.aws_region

  tags = {
    Name = "letschat-ecr-api-endpoint"
  }
}

# ECR DKR Interface Endpoint
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids        = module.vpc.private_subnets
  security_group_ids = [aws_security_group.letschat_sg.id]
  private_dns_enabled = true
  region = var.aws_region

  tags = {
    Name = "letschat-ecr-dkr-endpoint"
  }
}

# S3 Gateway Endpoint (used internally by ECR)
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = module.vpc.vpc_id
  service_name = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids = module.vpc.private_route_table_ids
  region = var.aws_region

  tags = {
    Name = "letschat-s3-endpoint"
  }
}

# SM Endpoint (used internally by ECS)
resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.${var.aws_region}.secretsmanager"
  vpc_endpoint_type = "Interface"
  subnet_ids        = module.vpc.private_subnets
  security_group_ids = [aws_security_group.letschat_sg.id]
  private_dns_enabled = true
  region = var.aws_region

  tags = {
    Name = "letschat-secretsmanager-endpoint"
  }
}

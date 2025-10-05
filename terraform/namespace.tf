resource "aws_service_discovery_private_dns_namespace" "letschat_namespace" {
  name        = "letschat" 
  description = "Private DNS namespace for LetsChat ECS services"
  vpc         = module.vpc.vpc_id
  region = var.aws_region

  tags = {
    Name        = "letschat-namespace"
  }
}

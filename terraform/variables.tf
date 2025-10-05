variable "aws_region" {
  description = "default region for deployment"
}

variable "backend_image" {
  description = "backend image for deployment"
}

variable "secret_arn" {
  description = "Secrets stored AWS Secrets Manager"
}

variable "name" {
  description = "name of backend task definition"
}

variable "cluster_name" {
  description = "cluster for deployment"
}
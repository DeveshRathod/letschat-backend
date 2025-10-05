output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnets" {
  value = module.vpc.public_subnets
}

output "private_subnets" {
  value = module.vpc.private_subnets
}

output "security_group_id" {
  value = aws_security_group.letschat_sg.id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.letschat.name
}

output "ecs_cluster_arn" {
  value = aws_ecs_cluster.letschat.arn
}

output "service_discovery_namespace_id" {
  value = aws_service_discovery_private_dns_namespace.letschat_namespace.id
}

output "service_discovery_namespace_name" {
  value = aws_service_discovery_private_dns_namespace.letschat_namespace.name
}

output "backend_service_discovery_name" {
  value = aws_service_discovery_service.letschat_backend.name
}

output "backend_service_discovery_arn" {
  value = aws_service_discovery_service.letschat_backend.arn
}

output "ecs_task_role_name" {
  value = aws_iam_role.ecs_task_role.name
}

output "ecs_task_role_arn" {
  value = aws_iam_role.ecs_task_role.arn
}

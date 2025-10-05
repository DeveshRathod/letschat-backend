resource "aws_ecs_service" "backend" {
  name            = "letschat-backend"
  cluster         = aws_ecs_cluster.letschat.id
  task_definition = aws_ecs_task_definition.letschat_backend.arn
  desired_count   = 3
  launch_type     = "FARGATE"
  region = var.aws_region

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.letschat_sg.id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = aws_service_discovery_service.letschat_backend.arn
  }

  depends_on = [aws_ecs_task_definition.letschat_backend]
}


resource "aws_service_discovery_service" "letschat_backend" {
  name = "letschat-backend"
  region = var.aws_region

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.letschat_namespace.id
    dns_records {
      type = "A"
      ttl  = 30
    }
    routing_policy = "MULTIVALUE"
  }

  tags = {
    Name = "letschat-backend-service"
  }
}


resource "aws_appautoscaling_target" "backend" {
  max_capacity       = 6
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.letschat.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu_policy" {
  name               = "backend-cpu-scaling"
  service_namespace  = "ecs"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    target_value       = 60.0          
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}

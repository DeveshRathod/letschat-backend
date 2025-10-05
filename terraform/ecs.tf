resource "aws_ecs_cluster" "letschat" {
  name = "letschat-cluster"
}

resource "aws_cloudwatch_log_group" "letschat_backend" {
  name              = "/ecs/letschat-backend"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "letschat_backend" {
  family                   = var.name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "${var.name}"
      image     = "${var.backend_image}"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "NODE_ENV", value = "development" },
        { name = "PORT", value = "3000" }
      ]
      secrets = [
        {
          name      = "MONGO"
          valueFrom = "${var.secret_arn}:MONGO::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${var.secret_arn}:JWT_SECRET::"
        },
        {
          name      = "CLOUDINARY_API_KEY"
          valueFrom = "${var.secret_arn}:CLOUDINARY_API_KEY::"
        },
        {
          name      = "CLOUDINARY_API_SECRET"
          valueFrom = "${var.secret_arn}:CLOUDINARY_API_SECRET::"
        },
        {
          name      = "CLOUDINARY_CLOUD_NAME"
          valueFrom = "${var.secret_arn}:CLOUDINARY_CLOUD_NAME::"
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/letschat-backend"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

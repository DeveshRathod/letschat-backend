terraform {
  backend "s3" {
    bucket = "devesh11411"
    key    = "dev/terraform.tfstate"
    region = "ap-south-1"
  }
}
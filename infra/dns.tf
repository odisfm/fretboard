locals {
  site_hostname = var.environment == "production" ? var.domain_name : "${var.environment}.${var.domain_name}"
}

data "cloudflare_zone" "main" {
  filter = {
    name = var.domain_name
  }
}


resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = local.site_hostname
  validation_method = "DNS"

  tags = {
    Environment = var.environment
    app: var.app_name
  }

  lifecycle {
    create_before_destroy = true
  }

}

resource "cloudflare_dns_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site.domain_validation_options : dvo.domain_name => {
      # ACM returns FQDNs with a trailing dot; Cloudflare stores them without,
      # so strip it to avoid a perpetual diff.
      name    = trimsuffix(dvo.resource_record_name, ".")
      type    = dvo.resource_record_type
      content = trimsuffix(dvo.resource_record_value, ".")
    }
  }

  zone_id = data.cloudflare_zone.main.id
  name    = each.value.name
  type    = each.value.type
  content = each.value.content
  ttl     = 1
  proxied = false
  comment = "ACM validation for ${local.site_hostname} (${var.environment}), managed by Terraform"
}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for r in cloudflare_dns_record.cert_validation : r.name]
}


resource "cloudflare_dns_record" "site" {
  zone_id = data.cloudflare_zone.main.id
  name    = local.site_hostname
  type    = "CNAME"
  content = aws_cloudfront_distribution.main.domain_name
  ttl     = 1
  proxied = false
  comment = "CloudFront (${var.environment}), managed by Terraform"
}

output "site_url" {
  value = "https://${local.site_hostname}"
}

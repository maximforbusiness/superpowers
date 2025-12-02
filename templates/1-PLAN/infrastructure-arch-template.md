# Infrastructure Architecture

**Last Updated**: [Date]  
**Status**: [Draft / Active / Deprecated]  
**Target State**: As-To-Be

## Overview

**Hosting Environment**: [Cloud Provider / On-Premise]  
**Regions**: [List of regions]

## Deployment Environment

### Production Environment
- **Server Configuration**: [vCPUs, RAM, Storage]
- **Operating System**: [e.g., Ubuntu 22.04 LTS]
- **Process Management**: [PM2 / systemd / etc.] (Note: No Docker per requirements)
- **Number of Instances**: [Single / Multiple]

### Staging Environment
- **Purpose**: [For UAT, pre-production testing]
- **Configuration**: [Details, should be as close to production as possible]

### Development Environment
- **Setup**: [Instructions for setting up a local development environment]

## Networking

- **Virtual Private Cloud (VPC)**: [VPC details]
- **Subnets**: [Public and private subnets]
- **Firewall/Security Groups**: [Rules for ingress and egress traffic]
- **DNS**: [How DNS is managed]

### Port and Endpoint Mapping
This section provides a preliminary map of the ports and endpoints used by the services in this project. All ports must be unique and non-standard.

| Service | Internal Port | External Endpoint (if applicable) | Description |
|---|---|---|---|
| Backend API | [e.g., 3873] | `https://api.example.com` | Main application API |
| [Other Service] | [e.g., 9100] | `http://localhost:9100/metrics` | Prometheus metrics exporter |
| | | | |

## Configuration Management

**Tool**: [Ansible / Puppet / Chef / Manual]  
**Configuration Source**: [Git repository / etc.]

### Required Environment Variables
```bash
NODE_ENV=development|staging|production
PORT=3873
DATABASE_URL=postgresql://...
JWT_SECRET=...
[List all required environment variables]
```

## Logging & Monitoring

### Logging
- **Log Aggregation**: [ELK Stack / Grafana Loki / CloudWatch Logs / etc.]
- **Log Format**: [JSON / Text]
- **Log Retention**: [How long logs are stored]

### Monitoring
- **Metrics Collection**: [Prometheus / InfluxDB / CloudWatch Metrics]
- **Dashboards**: [Grafana / CloudWatch Dashboards]
- **Key Metrics to Monitor**:
    - CPU Utilization
    - Memory Usage
    - Disk Space
    - API Latency (p95, p99)
    - Error Rate

### Alerting
- **Tool**: [Alertmanager / Grafana Alerting / CloudWatch Alarms]
- **Critical Alerts**:
    - [Alert condition 1: e.g., High CPU > 90% for 5 mins]
    - [Alert condition 2: e.g., 5xx Error Rate > 1%]
- **Notification Channels**: [Slack / PagerDuty / Email]

## Security

### Secrets Management
- **Storage**: [Environment variables / HashiCorp Vault / AWS Secrets Manager]
- **Rotation**: [Strategy for rotating secrets]
- **Access**: [Who has access to secrets]

### HTTPS
- **Enforcement**: [How HTTPS is enforced, e.g., load balancer redirect]
- **Certificate Management**: [Let's Encrypt / AWS ACM / etc.]

## Build and Deployment

### Build Process
- **CI/CD Tool**: [Jenkins / GitLab CI / GitHub Actions / Manual]
- **Build Steps**:
    1. [Install dependencies]
    2. [Run linters and tests]
    3. [Create build artifact]

### Deployment Process
1. [Build artifact is transferred to server]
2. [Database migrations are run]
3. [Application is restarted (e.g., `pm2 reload`)]

### Health Check Endpoint
- **Path**: `GET /health` or `GET /api/health`
- **Response**: `{ "status": "ok" }`

### Graceful Shutdown
- [How the application handles shutdown signals (e.g., `SIGINT`)]
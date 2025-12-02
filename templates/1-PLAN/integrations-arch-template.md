# External Integrations

**Last Updated**: [Date]  
**Status**: [Draft / Active / Deprecated]  
**Target State**: As-To-Be

## Overview

This document outlines the architecture and design for integrating with external third-party services.

## [Integration Name 1]

- **Purpose**: [What this integration provides, e.g., "Payment processing", "Email delivery"]
- **Provider**: [Name of the third-party service, e.g., "Stripe", "SendGrid"]
- **Documentation**: [Link to official API documentation]

### Integration Details
- **Library/SDK**: [Name of the library or SDK used, if any]
- **Authentication**: [API Key / OAuth 2.0 / etc.]
- **Authentication Method**: [e.g., "API Key in Authorization header"]

### Endpoints Used
- `POST /v1/charges`: [Purpose, e.g., "To create a payment"]
- `GET /v1/customers/{id}`: [Purpose, e.g., "To retrieve customer details"]
- [List all other endpoints used]

### Data Flow
[Describe or diagram how data flows between our system and the external service.]

### Error Handling
- **Strategy**: [How failures are managed, e.g., "Retry with exponential backoff"]
- **Specific Errors Handled**:
    - `401 Unauthorized`: [Action, e.g., "Refresh token or alert for invalid key"]
    - `429 Too Many Requests`: [Action, e.g., "Queue request and retry later"]
    - `5xx Server Error`: [Action, e.g., "Alert and investigate provider status"]

### Rate Limiting
- **Provider Limits**: [Published rate limits from the provider's documentation]
- **Our Strategy**: [How we stay within the limits, e.g., "Use a leaky bucket algorithm"]

### Fallback Strategy
- **If Service is Unavailable**: [What happens if the service is down, e.g., "Switch to a secondary provider", "Queue jobs for later processing", "Display a message to the user"]

## [Integration Name 2]

- **Purpose**: [Purpose]
- **Provider**: [Provider Name]
- **Documentation**: [Link]

### Integration Details
- **Library/SDK**: [Library]
- **Authentication**: [Auth method]

[... and so on for each integration ...]
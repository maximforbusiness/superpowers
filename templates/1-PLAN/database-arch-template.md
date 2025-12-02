# Database Architecture

**Last Updated**: [Date]  
**Status**: [Draft / Active / Deprecated]  
**Target State**: As-To-Be

## Overview

**Database System**: [PostgreSQL / MySQL / MongoDB / etc.]  
**Version**: [Database version]  
**Hosting**: [Cloud provider / Self-hosted]

## Data Models

[This section should contain ERDs (Entity-Relationship Diagrams) or other visual representations of the data model.]

### [Model Name 1]
- **Description**: [Purpose of the model]
- **Attributes**:
    - `id`: [Type, Primary Key]
    - `attribute_1`: [Type, Constraints]
    - `attribute_2`: [Type, Constraints]
    - `created_at`: [Type]
    - `updated_at`: [Type]
- **Relationships**:
    - [Relationship type] with [Model Name 2]

[Repeat for each data model]

## Schema Design

### Table: `[table_name_1]`
```sql
CREATE TABLE [table_name_1] (
    id SERIAL PRIMARY KEY,
    -- columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

[Repeat for each table, showing the SQL schema]

## Data Access Layer

**Pattern**: [Repository Pattern / Active Record / Query Builder / Raw SQL]

### Repository Pattern (if used)
- **Repositories**: `src/repositories/`
- One repository per data model.
- Abstract database operations.

### Database Connection Management
- **Connection Pool**: [Configuration and size]
- **Connection String**: [Stored in environment variable]
- **Retry Logic**: [How connection failures are handled]

## Query Strategy

- **ORM Usage**: [When ORM is used vs raw queries]
- **Transaction Management**: [How transactions are handled]
- **Query Optimization**: [Indexing strategy, query patterns]

## Migrations

**Tool**: [Flyway / Liquibase / Knex.js / etc.]  
**Strategy**: [How and when migrations are run]

## Backup and Recovery

**Backup Strategy**:
- **Frequency**: [e.g., Daily, Weekly]
- **Method**: [e.g., Snapshots, logical dumps]
- **Retention**: [How long backups are kept]

**Recovery Plan**:
- **RPO (Recovery Point Objective)**: [e.g., 1 hour]
- **RTO (Recovery Time Objective)**: [e.g., 4 hours]
- **Procedure**: [Steps to restore from backup]
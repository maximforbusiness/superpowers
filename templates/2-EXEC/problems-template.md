# Problems & Resolutions Log

**Project**: [Project Name]  
**Last Updated**: [Date]  
**Maintainers**: All agents (update when encountering/solving issues)

---

## Purpose

This document tracks all significant problems, errors, and challenges encountered during implementation, along with their resolutions. This serves as:

- **Learning Resource**: Future reference for similar issues
- **Debugging Aid**: Understanding what was tried and what worked
- **Project History**: Record of challenges overcome
- **Knowledge Base**: Tribal knowledge preservation

---

## How to Use This Document

**When to add an entry**:
- ✅ Encountered a bug that took > 30 minutes to resolve
- ✅ Faced architectural challenge requiring deviation
- ✅ Discovered unexpected behavior in framework/library
- ✅ Security vulnerability found and fixed
- ✅ Performance issue identified and resolved
- ✅ Integration problem with external service
- ✅ Database migration issue
- ✅ Deployment/configuration problem

**When NOT to add**:
- ❌ Simple typos or syntax errors
- ❌ Trivial issues resolved in < 5 minutes
- ❌ Expected behavior (not a problem)

**Format**: Use the template below for each entry.

---

## Problem Entry Template

```markdown
### [PROBLEM-###] Brief Description

**Date**: YYYY-MM-DD  
**Discovered By**: [Agent Name]  
**Severity**: BLOCKER / CRITICAL / MAJOR / MINOR  
**Category**: Bug / Architecture / Performance / Security / Integration / Deployment / Other  
**Related Task**: TASK-XXX (if applicable)

#### Problem Description

[Detailed description of the problem, symptoms, error messages]

#### What Was Tried

1. [First attempt - why it didn't work]
2. [Second attempt - why it didn't work]
3. [etc.]

#### Root Cause

[Analysis of why the problem occurred]

#### Solution

[What actually fixed the problem]

**Code/Config Changes**:
```
[Show relevant code or config changes]
```

#### Prevention

[How to prevent this problem in the future / what we learned]

**Related References**:
- [Links to documentation, Stack Overflow, GitHub issues, etc.]

---
```

---

## Problems Log

<!-- Add new problems below, most recent first -->

### [PROBLEM-001] Example: Database Connection Pool Exhaustion

**Date**: 2024-01-15  
**Discovered By**: Backend Developer Agent  
**Severity**: CRITICAL  
**Category**: Performance  
**Related Task**: TASK-042

#### Problem Description

Application crashed in production after ~100 concurrent users. Error: "Too many clients already connected". Database connection pool was exhausting, causing new requests to fail.

#### What Was Tried

1. **Increased pool size to 100**: Temporarily solved, but crashed again at 200 users
2. **Added connection timeout**: Didn't help - connections were legitimately in use
3. **Restarted database**: Temporary fix, problem returned

#### Root Cause

Backend code was not properly releasing database connections after queries completed. Connections were held open in finally blocks that never executed due to incorrect error handling.

#### Solution

Fixed connection release pattern:

```javascript
// BEFORE (incorrect)
async function getUser(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
  // client.release() never reached if error thrown!
}

// AFTER (correct)
async function getUser(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release(); // ALWAYS executes
  }
}
```

**Additional Changes**:
- Set connection pool max to 20 (sufficient with proper release)
- Added connection pool monitoring with alerts
- Added unit tests to verify connection release

#### Prevention

- **Code Review Checklist**: Added "Verify database connection release in finally block"
- **Linting Rule**: Added ESLint rule to detect missing `.release()` calls
- **Monitoring**: Set alert for connection pool utilization > 80%
- **Testing**: Created load test that runs before deployment

**Related References**:
- [node-postgres connection pool docs](https://node-postgres.com/features/pooling)
- [Stack Overflow: Proper connection release pattern](https://stackoverflow.com/q/12345678)

---

<!-- Add more problems below -->


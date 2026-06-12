# NavalCommand Post-Deployment Procedures

This document outlines the standard operating procedures for the engineering team following a successful deployment of NavalCommand to the production environment.

## 1. Issue Tracking & Ticket Close-Out

Once the CI/CD pipeline reports a successful production build and the health checks pass:
- **Verify Live Environment:** Perform a manual smoke test on the production URL. Verify the login flow, dashboard data fetching, and role-based routing.
- **Update Ticket Status:** Move the associated feature/bug tickets in the issue tracker (e.g., Jira, GitHub Projects) to the "Done" or "Closed" state.
- **Link Deployments:** Ensure the specific Git commit hash or release tag is referenced in the closed ticket for traceability.

## 2. Feature Flag Cleanup

If the release utilized temporary feature flags (e.g., routing traffic progressively to the new Dashboard layout):
- Monitor system metrics for 48 hours post-deployment.
- If no critical anomalies are detected, create a follow-up chore ticket to remove the feature flag evaluation logic from the codebase.
- Delete the feature flag entry from your feature management platform (e.g., LaunchDarkly, Vercel Edge Config) to maintain a clean environment state.

## 3. Residual Code Scrubbing

Prior to final sign-off, ensure the following has been completed (verified during Phase 8 implementation):
- **Debug Logging:** All unnecessary `console.log` or `console.debug` statements used during development must be scrubbed from the `src/` directory. (Note: Meaningful `console.error` logs in `src/services/` for catching network/DB failures should be retained).
- **Deprecated Logic:** Any legacy code related to the deprecated "Whitelist" or "Excel Import" functionalities must be entirely removed from the active branch to prevent dead code accumulation.

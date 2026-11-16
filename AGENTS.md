
# QA Automation Project Instructions

## Project
This is a Playwright + TypeScript QA automation project.

Primary architecture:
- Playwright Test
- TypeScript
- Page Object Model
- Custom fixtures
- API testing
- Mocking and network interception

## General Rules
1. Inspect existing project structure before changing code.
2. Reuse existing Page Objects and fixtures.
3. Do not create duplicate utilities.
4. Prefer readable and maintainable test code.
5. Do not invent business requirements.
6. Do not modify production application code.
7. Never expose secrets or credentials.

## Playwright Rules
- Use @playwright/test.
- Prefer getByRole, getByLabel and getByTestId.
- Avoid waitForTimeout.
- Use Playwright auto-waiting and web-first assertions.
- Keep tests independent.
- Avoid shared mutable test data.
- Use request contexts for API tests.
- Use page.route for UI network mocking when appropriate.
- Do not blindly increase timeouts or retries.

## POM Rules
- Store Page Objects in pages/.
- Store reusable fixtures in fixtures/.
- Store helper functions in utils/.
- Prefer meaningful method names.
- Keep business assertions in tests unless an
  existing project convention specifies otherwise.

## Approval Rules
- Never weaken assertions to make tests pass.
- Never skip failing tests without explicit approval.
- Never delete existing tests without approval.
- Never create Jira issues without approval.
- Never modify CI/CD configuration without approval.

## Subagent Workflow
For new functionality:
1. requirements_analyst
2. test_designer
3. playwright_generator or pom_architect
4. test_reviewer
5. failure_analyst if tests fail

Run independent read-only analysis in parallel.
Do not let multiple agents edit the same files.

## Output Language
Explain findings and final reports in Ukrainian.
Use English for code identifiers and filenames.

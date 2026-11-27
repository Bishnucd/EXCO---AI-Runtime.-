---
name: mockito-java-mock-dependency-injection
description: Mocks external dependencies and verifies method invocations in Java test suites using Mockito. Use when isolating unit tests from external databases, networks, and services.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://site.mockito.org/"
---
# Mockito Java Mock Dependency Injection

## Overview
Unit tests must test single classes in isolation. Mockito creates mock instances of interfaces and classes, stubbing method returns with when().thenReturn() and verifying calls with verify().

## Operational Workflow

1. **Annotate test class with @ExtendWith(MockitoExtension.class) and mock fields with @Mock.**:
   - Annotate test class with @ExtendWith(MockitoExtension.class) and mock fields with @Mock.

2. **Inject mocks into class under test using @InjectMocks.**:
   - Inject mocks into class under test using @InjectMocks.

3. **Stub method return values**:
   - Stub method return values: when(userRepository.findById(1L)).thenReturn(Optional.of(testUser)).

4. **Execute method and verify interactions**:
   - Execute method and verify interactions: verify(emailService, times(1)).sendWelcomeEmail(testUser).

## Recommended Tools & Environments
- Mockito
- Java
- Mocking / Stubbing
- JUnit 5

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.

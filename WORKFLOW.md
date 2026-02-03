# Iterative Development Workflow

This project uses an **iterative development workflow** that emphasizes continuous testing and rapid feedback loops between development and quality assurance.

## 🎯 Core Principle

**Develop → Test → Get Feedback → Iterate → Test Again**

Instead of developing all features and testing at the end, we test continuously throughout development.

## 📋 Workflow Steps

### 1. **Start Development** (Write Code)
```bash
npm run dev          # Start development server
npm run test:watch   # Start test watcher in another terminal
```

### 2. **Write Tests First (TDD Approach)**
- Write a test for the feature you're about to build
- See it fail (Red)
- Write minimal code to make it pass (Green)
- Refactor if needed (Refactor)

### 3. **Continuous Testing During Development**
- Tests run automatically in watch mode as you code
- Get immediate feedback on breaking changes
- Fix issues before they compound

### 4. **Pre-Commit Quality Check**
Before committing, run:
```bash
npm run quality      # Runs lint + tests
```

This ensures code quality before it enters the repository.

### 5. **Continuous Integration (CI)**
- Every push triggers automated tests
- Every pull request must pass all tests
- Build must succeed before merging

## 🛠️ Available Commands

### Development
```bash
npm run dev          # Start development server
npm run test:watch   # Run tests in watch mode (recommended during dev)
npm run test:dev     # Alias for test:watch
```

### Testing
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode (auto-reruns on file changes)
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests for CI (no watch, with coverage)
```

### Quality Assurance
```bash
npm run lint         # Check code style
npm run quality      # Run lint + tests (use before committing)
```

## 🔄 Daily Development Cycle

```
┌─────────────────────────────────────────────────────────┐
│                    START FEATURE                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  1. Write Test (or update existing test)                │
│     npm run test:watch                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Write Code to Make Test Pass                       │
│     npm run dev                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Test Passes? ──YES──► Refactor ──► Continue        │
│     │                                                    │
│     NO                                                   │
│     │                                                    │
│     ▼                                                    │
│  Fix Code ──► Test Again                                │
└─────────────────────────────────────────────────────────┘
```

## 📊 Quality Gates

### Before Committing
- ✅ All tests pass (`npm run test`)
- ✅ No linting errors (`npm run lint`)
- ✅ Code builds successfully (`npm run build`)

### Before Pushing
- ✅ Run `npm run quality` (lint + tests)
- ✅ Review test coverage
- ✅ Ensure CI will pass

### Before Merging PR
- ✅ All CI checks pass
- ✅ Code review approved
- ✅ Tests have adequate coverage

## 🎯 Benefits of This Workflow

1. **Early Bug Detection**: Catch issues immediately, not at the end
2. **Confidence**: Know your code works as you write it
3. **Faster Feedback**: Get test results in seconds, not hours
4. **Better Code Quality**: Continuous testing encourages better design
5. **Reduced Technical Debt**: Fix issues before they accumulate

## 📝 Best Practices

### Writing Tests
- Write tests for new features **before** or **alongside** implementation
- Test behavior, not implementation details
- Keep tests simple and focused
- Use descriptive test names

### During Development
- Keep `npm run test:watch` running in a separate terminal
- Run `npm run quality` before committing
- Fix failing tests immediately
- Don't skip tests to "save time" (it costs more later)

### Code Review
- Review tests along with code
- Ensure new features have tests
- Check test coverage for changed areas

## 🚀 Getting Started

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development with testing**:
   ```bash
   # Terminal 1: Development server
   npm run dev
   
   # Terminal 2: Test watcher
   npm run test:watch
   ```

3. **Make a change** and watch tests run automatically!

## 📈 Monitoring Quality

- Check test coverage: `npm run test:coverage`
- View coverage report in `coverage/lcov-report/index.html`
- Aim for >80% coverage on new code

## 🔗 Integration with CI/CD

- Tests run automatically on every push
- Failed tests block merging
- Coverage reports are generated automatically
- Build must succeed before deployment

---

**Remember**: Quality is not a phase, it's a continuous process! 🎯

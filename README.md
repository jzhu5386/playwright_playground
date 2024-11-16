# playwright_take2

This is a personal playwright playground, where I had updated playwright demo tests to use POM modal.
This is setup with Typescript.

To run the test:

```
yarn test-regression
```

Email Reader using Gmail API

```
yunzhu@Yuns-MacBook-Pro tests % npx playwright test email-reader.spec.ts
(node:15753) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

Running 1 test using 1 worker

  ✓  1 email-reader.spec.ts:5:7 › New Todo @regression › test we can read email (570ms)
(node:15773) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
found messages: <div dir="ltr">Hello,<div><br></div><div>If you see this email, you have cracked the Gmail API!</div><div><br></div><div>Julie</div></div>


  1 passed (2.4s)
yunzhu@Yuns-MacBook-Pro tests %
```

# Facebook API

### Error handling

- **HTTP error classes** - make throwing errors more intuitive and explicit

```js
// Before
if (doesExist) {
  throw new Error('User already exists')
}
```

```js
// After
if (doesExist) {
  throw new Conflict('User already exists')
}
```

- **Error handler middleware** - handles all errors in one place

```js
// Before
try {
  const user = await UserService.register(req.body)
  res.json({ data: user })
} catch (error) {
  res.json({
    error: {
      code: error.code,
      message: error.message,
    },
  })
}
```

```js
// After
try {
  const user = await UserService.register(req.body)
  res.json({ data: user })
} catch (error) {
  next(error)
}
```

- **express-async-errors package** - passes thrown errors straight to error handler

```js
// Before
try {
  const user = await UserService.register(req.body) // this will throw
  res.json({ data: user })
} catch (error) {
  next(error)
}
```

```js
// After
const user = await UserService.register(req.body) // this will throw
res.json({ data: user })
```

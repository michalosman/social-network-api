# Facebook API

## Error handling

### HTTP error classes 
Make throwing errors more intuitive and explicit

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

### Error handler middleware
Handles all errors in one place

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

### express-async-errors library
Passes thrown errors straight to error handler

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

## Authentication

### Process flowchart

![jwt](https://user-images.githubusercontent.com/40360401/167729479-cecbc8fc-56ef-4f13-882b-c0eff7437a0a.png)

// TODO elaborate on the aproach to authentication

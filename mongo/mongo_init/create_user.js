db.createUser({
  user: 'loginsystem',
  pwd: 'loginsystem',
  roles: [
    {
      role: 'readWrite',
      db: 'loginsystem'
    },
    {
      role: 'dbAdmin',
      db: 'loginsystem'
    },
  ]
})

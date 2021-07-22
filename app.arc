@app
frourio-next-app

@http
/api/*
  method any
  src /frourio-handler

@tables
data
  scopeID *String
  dataID **String
  ttl TTL

@static
folder out

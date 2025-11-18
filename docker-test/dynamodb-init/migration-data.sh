# aws dynamodb put-item\
#   --table-name WsConnection\
#   --item file://./init/data/todo.json\
#   --endpoint-url http://dynamodb-local:8000
  
aws dynamodb put-item\
  --table-name WsConnection\
  --item file://./init/data/connections.json\
  --endpoint-url http://dynamodb-local:8000
  
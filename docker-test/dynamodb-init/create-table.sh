# aws dynamodb create-table\
#   --table-name WsConnection\
#   --attribute-definitions '[{"AttributeName":"PK","AttributeType":"S"}, {"AttributeName":"SK","AttributeType":"S"}]'\
#   --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE\
#   --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1\
#   --endpoint-url http://dynamodb-local:8000

# aws dynamodb create-table\
#   --table-name WsConnection\
#   --attribute-definitions '[{"AttributeName":"connId","AttributeType":"S"}]'\
#   --key-schema AttributeName=connId,KeyType=HASH\
#   --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1\
#   --endpoint-url http://dynamodb-local:8000

aws dynamodb create-table \
  --table-name WsConnection \
  --attribute-definitions '[
    {"AttributeName":"connId","AttributeType":"S"},
    {"AttributeName":"userId","AttributeType":"N"},
    {"AttributeName":"userUid","AttributeType":"S"}
  ]' \
  --key-schema AttributeName=connId,KeyType=HASH \
  --global-secondary-indexes '[
    {
      "IndexName": "userId-index",
      "KeySchema":[
        {"AttributeName":"userId","KeyType":"HASH"}
      ],
      "Projection":{
        "ProjectionType":"ALL"
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    },
    {
      "IndexName": "userUid-index",
      "KeySchema":[
        {"AttributeName":"userUid","KeyType":"HASH"}
      ],
      "Projection":{
        "ProjectionType":"ALL"
      },
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    }
  ]' \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://dynamodb-local:8000

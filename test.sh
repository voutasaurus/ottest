# wait for services to be up
function waitup {
  for i in {1..10}
  do
      curl http://localhost:8082/hello 2> /dev/null
      if [[ $? == 0 ]]
      then
          return 0
      fi
      sleep 1
  done
  return 1
}

_=$(waitup)
if [[ $? -ne 0 ]]
then
    >&2 echo "stack unreachable after 10 seconds wait time"
    exit 1
fi

set -e

curl http://localhost:8080/hello
curl http://localhost:8081/hello
curl http://localhost:8082/hello
curl http://localhost:8080/
curl http://localhost:8081/
curl http://localhost:8082/

# websocket-api-server-test

## Installation

```console
~/websocket-api-server-test$ npm install
~/websocket-api-server-test$ npm install --only=dev
```

## Start Unit Test

- Start docker containers

  - if your host does not have docker images, this command will automatically pull the images.

```console
~/websocket-api-server-test$ cd xinobi-docker-test && sh backend.sh up && cd ..
Starting xinobi backend containers
[+] Running 4/4
 ✔ Network xinobi-docker-test_default           Created                                                                    0.1s
 ✔ Container mongodb                            Started                                                                    0.7s
```

- Perform your unit tests

```console
~/websocket-api-server-test$ npm test --config=./config.test.json
```

- Stop and clean up docker containers

```console
~/websocket-api-server-test$ cd xinobi-docker-test && sh backend.sh down && cd ..
Stopping docker containers
[+] Running 2/2
 ✔ Container mongodb                            Removed                                                                    0.4s
 ✔ Network xinobi-docker-test_default           Removed                                                                    0.1s
Cleaning docker volumes
d2d7469171f07da328c50a996265b42c99ea406141e202af1127c6a4207ec674
```

# 启动容器 shell
#!/bin/bash

curPath=`cd $(dirname $0);pwd -P`

# 运行
docker run --name todayHot -d -v $curPath:/workspace -p 8888:8888 today-hot
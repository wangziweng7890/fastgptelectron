#!/bin/bash

# 获取git配置信息
git_email=$(git config user.email)
git_username=$(git config user.name)
git_branch=$(git rev-parse --abbrev-ref HEAD)

# 获取当前时间
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
# 本地文件夹路径
local_folder="./main/"

# 服务器IP地址
server_ip=$1

# 远程文件夹路径
remote_folder=$2

# 远程服务器用户名
remote_user=$3

# 远程服务器地址
remote_server="${remote_user}@${server_ip}"

echo "服务器ip: ${server_ip}, 远程文件夹: ${remote_folder}, 用户名: ${remote_user}"

# 生成临时upload_log文件
temp_file="${local_folder}/upload_log.txt"

# 持久化ssh-agent,避免重启后失效
# if [ ! "$SSH_AUTH_SOCK" ]; then
#   eval $(ssh-agent -s)
#   echo "SSH_AUTH_SOCK=$SSH_AUTH_SOCK; export SSH_AUTH_SOCK" >> ~/.bashrc
# fi

# 判断是否存在私钥文件,如果不存在则生成密钥对
if [ ! -f ~/.ssh/id_rsa ]; then
   # 生成密钥对
  ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
fi

# 判断是否还需要添加私钥
if ssh $remote_server true; then
  echo "SSH 连接成功!"
else
  echo "正在添加私钥"
  pubkey_file="~/.ssh/authorized_keys"

  # 免密拷贝公钥到远程主机
  ssh $remote_server "mkdir -p ~/.ssh && \
    echo $(cat ~/.ssh/id_rsa.pub) >> $pubkey_file"
fi

# 下载服务器上的upload_log.txt文件到本地
scp "${remote_server}":"$remote_folder/upload_log.txt" ${temp_file}

# 更新upload_log.txt文件
write_txt() {
    current_file="${local_folder}/current_upload_log.txt"
    echo "operator:  ${git_username} <${git_email}>" >> "${current_file}"
    echo "operation_time:  ${timestamp}" >> "${current_file}"
    echo "branch:  ${git_branch}" >> "${current_file}"
    echo "record:  ${local_folder} --> ${server_ip}:${remote_folder}" >> "${current_file}"
    echo "" >> "${current_file}"
    # 合并临时文件和原始文件
    cat "$current_file" "$temp_file" > tmp2.txt

    # 将合并后的文件重命名为原始文件
    mv tmp2.txt "$temp_file"

    # 删除临时文件
    rm "$current_file"
}

# 检查文件是否存在
if [ -e "$temp_file" ]; then
    echo "已下载日志文件"
else
    echo "无日志文件"
    echo "" >> "${temp_file}"
fi

# 写入日志
write_txt

# 判断操作系统类型
case "$(uname -s)" in
    Darwin*)    # Mac
        # 上传文件夹下的所有资源到服务器
        rsync -avz -e "ssh -i ~/.ssh/id_rsa" "$local_folder" "${remote_server}":"$remote_folder"
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        # 上传文件夹下的所有资源到服务器
        scp -r -v "${local_folder}." "${remote_server}":"$remote_folder"
        ;;
    *)
        echo "未知系统"
        exit 1
        ;;
esac

# 删除临时文件
rm ${temp_file}

echo "文件更新完毕"
echo "请查看日志文件: ${4}/upload_log.txt"

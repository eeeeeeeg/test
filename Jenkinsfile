pipeline {
    agent none
        triggers {
        gitlab(
            triggerOnPush: true,
            branchFilterType: 'NameBasedFilter',
            excludeBranchesSpec: "",
            pendingBuildName: env.JOB_NAME.split('/')[0],
            secretToken: env.JOB_NAME.split('/')[0],
            branchFilterName: '*dev' // 匹配所有以dev开头的分支
        )
    }
    stages {
        stage('build-package') {
            agent {
                docker {
                    image 'node:18.19.0-alpine'
                    args '-v /data/node_modules:${WORKSPACE}/node_modules'
                    label 'docker'
                }
            }
            steps {
                script {
                    set_env()
                    if (isTag()) {
                        // tag部分执行
                        sh 'npm set audit false'
                        sh 'npm install --registry=https://registry.npmmirror.com/ --loglevel=verbose'
                        sh 'npm run build:prod'
                        archiveArtifacts(artifacts: 'dist/*', onlyIfSuccessful: true)
                    } else if (!isTag() && isDev()) {
                        // dev部分执行
                        sh 'npm set audit false'
                        sh 'npm install --registry=https://registry.npmmirror.com/ --loglevel=verbose'
                        sh 'npm run build:stage'
                        sh "tar -czf ${package_name} dist/*"
                        stash(name: "package", includes: "${package_name}")
                    } else if (!isTag() && !isDev()) {
                        // release/master执行
                        sh 'npm set audit false'
                        sh 'npm install --registry=https://registry.npmmirror.com/ --loglevel=verbose'
                        sh 'npm run build:prod'
                        archiveArtifacts(artifacts: 'dist/*', onlyIfSuccessful: true)
                    }
                }
            }
        }
        
        stage('control') {
            agent {
                label 'controller'
            }
            when {
                not {
                    buildingTag()
                }
            }
            steps {
                script {
                    checkandcreatedir(env.controller_service_home)
                    checkandcreatedir(env.controller_project_home)
                    checkandcreatedir("${controller_service_home}/backup")
                    dir("${controller_service_home}"){
                        sh 'for f in *-dist.tar.gz;do var1=${f%}; mv $f "backup/backup-`date +%Y%m%d`-${var1}";done || true'
                        unstash("package")
                    }
                    dir("${controller_ansible_home}") {
                        script {
                            try {
                                sh "ansible-playbook front.yml -e action=update -e service_name=${service_name} -e inventory=${inventory}"
                            }catch(err){
                                echo "update  error !!!!!!!!!"
                            }
                        }
                    }
                }
            }
        }
    }
}

def isTag() { return env.TAG_NAME != null && env.TAG_NAME != "" }
def isDev() { return env.Branch_name == 'dev' }
def get_service_name() { return env.GIT_URL.split('/').last().replaceFirst(/.git$/, "") }
def set_env() {
    env.service_name = get_service_name()
    if (isTag()) {
        env.inventory = "master"
    } else {
        env.inventory = env.Branch_name
    }
    if (isDev()) {
        env.registry_url = 'http://172.16.200.105:5001/'
    } else {
        env.registry_url = 'http://10.8.1.101:5001/'
    }
    env.package_name = "${inventory}-dist.tar.gz"
    env.project_name = 'app'
    env.controller_project_home = "/data/${project_name}"
    env.controller_service_home = "${controller_project_home}/${service_name}"
    env.controller_ansible_home = "/data/ansible/${project_name}"
    env.JAVA_HOME = '/data/java'
}
def checkandcreatedir(dirPath) { 
    if (!fileExists(dirPath)) { sh "mkdir -p ${dirPath}" }
}

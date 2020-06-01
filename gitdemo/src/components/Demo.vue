<template>

    <div>

        <el-row class="warp">
            <div class="my-el-table">
                <el-table :data="tdata"  ref="multipleTable" >
                    <el-table-column prop="id" label="项目编号" ></el-table-column>
                    <el-table-column prop="name" label="项目名称" >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="qiehuan(scope.row.name,scope.row.id)">{{scope.row.name,scope.row.id}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="path_with_namespace" label="项目路径"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" >
                            <el-dropdown-item>
                                <el-button size="mini" type="primary"   @click = "oragerssh(scope.row.id,scope.row.ssh_url_to_repo,scope.row.name)">SSH下载</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item>
                            <el-button size="mini" type="primary"   @click = "orager(scope.row.id,scope.row.http_url_to_repo,scope.row.name)">HTTP下载</el-button>
                                　</el-dropdown-item>

                            <el-dropdown-item>
                                <el-button size="mini" type="primary"   @click = "upload(scope.row.name)">提交项目</el-button>
                            </el-dropdown-item>
                        </template>
                    </el-table-column>


                </el-table>


                <!--                以下为选择项目分支的弹窗-->
                <el-dialog title="选择分支" :visible.sync="centerD" center>
                    <el-table :data="list" border style="width: 100%">
                        <el-table-column prop="name" label="分支名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope" >
                                <el-dropdown-item>
                                    <el-button size="mini"  type="primary"  @click = "download(scope.row.name)">下载分支</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button size="mini" type="danger"   @click = "lishi(scope.row.name)">查看版本</el-button>
                                </el-dropdown-item>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="centerD = false">取 消</el-button>
                    </span>
                </el-dialog>



<!--                以下为选择版本的弹窗-->
                <el-dialog title="选择版本" :visible.sync="centerDialogVisible" center>
                    <el-table :data="cc" border style="width: 100%">
                        <el-table-column prop="id" label="编号"></el-table-column>
                        <el-table-column prop="author_name" label="更新人"></el-table-column>
                        <el-table-column prop="authored_date" label="更新时间"></el-table-column>
                        <el-table-column prop="message" label="备注"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope" >
                                <el-button size="mini" type="primary" plain @click = "gengxin(scope.row.id)">回退此版本</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-row>
    </div>




</template>


<script>

    import { exec } from 'child_process'

    export default {

        data() {
            return {
                url:'',
                token:'',
                tdata:[],
                //项目数据
                GitLab: {},
                //项目分支数据
                list:[],
                //项目历史版本
                cc:[],
                //查看分支弹窗
                centerD:false,
                //选择版本弹窗
                centerDialogVisible: false,
                //分支名称
                branchname:'',
                //项目地址
                xiangmuurl:null,
                testid:null,
                testname:null,
                xiangmuname:'',
                valuess:'',
            };
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            '$route': 'test'
        },
        created(){
            this.test()

        },
        methods: {
            test(){
                let that=this
                that.url= localStorage.getItem("giturl")
                that.token= localStorage.getItem("tokens")
                that.tdata=JSON.parse(localStorage.getItem("projects"))

            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //查看分支
            orager(id,http_url_to_repo,name){
                let that=this
                let apiURL = this.url+'api/v4/projects/'+id+'/repository/branches/?private_token='+this.token
                this.testid=id;
                this.xiangmuurl=http_url_to_repo,
                this.testname=name,
                that.xiangmuname=name,
                this.$http.get(apiURL).then((response) => {
                    this.list=response.data;
                    this.centerD = true
                })
            },
            oragerssh(id,ssh_url_to_repo,name){
                let that=this
                let apiURL = this.url+'api/v4/projects/'+id+'/repository/branches/?private_token='+this.token
                this.testid=id;
                that.xiangmuname=name,
                this.xiangmuurl=ssh_url_to_repo,
                    this.testname=name,
                    this.$http.get(apiURL).then((response) => {
                        this.list=response.data;
                        this.centerD = true
                    })
            },
                //下载项目
            download (name) {
                let that=this

                const cmdStr = 'cd &&'+'git clone ' + this.xiangmuurl+ ' --branch '+name
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                })
                this.centerD=false

                setTimeout(that.ls,2000)
            },
            ls(){
                let that=this
                var cc=that.xiangmuname
                const cmd = 'cd && ls'
                const worker = exec(cmd, {})
                worker.stdout.on('data', function (data) {
                    if(data.includes(cc)){
                        setTimeout(that.success)
                    }else{
                        setTimeout(that.successs)
                    }

                })
            },
            // //上传项目
            upload(name){
                let that=this
                that.xiangmuname=name
                this.$prompt('请输入本次提交的描述信息',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '必须输入',
                }).then(({ value }) => {
                that.valuess=value
                const cmd = 'cd &&cd '+name+' && git branch'
                const worker = exec(cmd, {})
                worker.stdout.on('data', function (data) {
                    that.branchname=data.split("*")[1]
                    const cmdStr = 'cd &&cd '+name+' && git add . && git commit -m'+ value+' && git push origin '+that.branchname
                    const workerProcess = exec(cmdStr, {})
                    workerProcess.stdout.on('data', function (data) {})
                })

                    setTimeout(that.wenjianlog,2000)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });




            },
            wenjianlog(){
                let that=this
                const cmdd = 'cd &&cd '+this.xiangmuname+' && git log -1 '
                const workerr = exec(cmdd, {})
                workerr.stdout.on('data', function (data) {
                    if(data.includes(that.valuess)){
                        setTimeout(that.success)
                    }else{
                        setTimeout(that.successs)
                    }
                })
            },
            success() {
                this.$message.success('很高兴，操作成功');
            },
            successs() {
                this.$message.success('很抱歉，操作失败');
            },
            //测试成功
            lishi(name){
                let apiURL = this.url+'api/v4/projects/'+this.testid+'/repository/commits?ref_name='+name+'&private_token='+this.token
                this.centerD = false
                this.$http.get(apiURL).then((response) => {
                    this.cc=response.data;
                    this.centerDialogVisible = true
                })
            },
            gengxin (id) {
                const cmdStr = 'cd &&cd '+this.testname+' && git reset --hard '+id
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    alert("版本回退成功")
                    console.log('stdout: ' + data)
                })
            },
            qiehuan(name,id){
                // alert(id)
                this.$router.push({
                    name:'file',
                    params:{
                        name,
                        id,
                    }
                })


            },

        },
        mounted: function () {
            //判断系统类型
            function OSnow(){
                var agent = navigator.userAgent.toLowerCase();
                var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
                if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
                    //your code
                    alert("这是windows32位系统");
                }
                if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
                    //your code
                    alert("这是windows64位系统");
                }
                if(isMac){
                    //your code
                    alert("这是mac系统");
                }
            }

        },
        computed: {
            ipaddrArray:function(){
                if(this.cc){
                    return this.cc.split('commit')
                }
             },


        }
    };
</script>
<style>
    th.column-money,
    td.column-money {
        text-align: right !important;
    }
</style>

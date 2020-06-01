<template>






    <div class="" id="box">
        <el-row style="float: left;" >
            <el-button type="text"    @click="qiehuan" >返回首页 </el-button>
            <el-button type="text"   icon="el-icon-d-arrow-right" @click="cyiji(yiji)">{{this.yiji}} </el-button>
            <el-button type="text"  v-for="(item,index) in caidan"  v-if='index>3' icon="el-icon-d-arrow-right" @click="cerji(item)">{{item}} </el-button>
        </el-row>








        <el-input v-model="search"  style="width:100%; margin-bottom:10px" placeholder="请输入搜索内容"/>
            <tr align="left">
                <td>
                    <el-button size="mini" type="primary"  @click ="piliangshangchuan()">批量提交<i class="el-icon-upload el-icon--right"></i></el-button>
                </td>
            </tr>
            <tr align="right">

                    <el-button size="mini" type="primary" @click ="shezhi" >打开方式<i class="el-icon-s-tools"></i></el-button>

            </tr>



        <!--鼠标右键菜单栏，其实就是添加一个基于鼠标位置的模态框而已 -->



        <el-table :data="tables" style="width: 100%"  ref="multipleTable"  @row-contextmenu="rowContextmenu">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column  label="文件类型" >
                <template slot-scope="scope" >
                    <span v-if="scope.row.substring(scope.row.length-4)=='.txt'||scope.row.substring(scope.row.length-4)=='.xml'||scope.row.substring(scope.row.length-5)=='.docx'">
                        <img src="../assets/txt.jpg" @dblclick="tab(scope.row)"/>
                    </span>
                    <span v-else-if="scope.row.substring(scope.row.length-4)=='.iml'||scope.row.substring(scope.row.length-4)=='.cmd'||scope.row.substring(scope.row.length-4)=='.sql'||scope.row.substring(scope.row.length-4)=='.yml'||scope.row.substring(scope.row.length-3)=='.md'">
                        <img src="../assets/kong.jpg" @dblclick="tab(scope.row)"/>
                    </span>
                    <span v-else-if="scope.row.substring(scope.row.length-4)=='.jar'">
                        <img src="../assets/jar.jpg" @dblclick="tab(scope.row)"/>
                    </span>
                    <span v-else-if="scope.row.substring(scope.row.length-4)=='.jpg'||scope.row.substring(scope.row.length-4)=='.png'||
                                                         scope.row.substring(scope.row.length-4)=='.svg'||scope.row.substring(scope.row.length-4)=='.bmp'||
                                                          scope.row.substring(scope.row.length-4)=='gif'||scope.row.substring(scope.row.length-5)=='.jpeg'
                                                           ||scope.row.substring(scope.row.length-5)=='.heic'">
                        <img  src="../assets/photo.jpeg"  @dblclick="tab(scope.row)"/>
                    </span>
                    <span v-else>
                          <img  src="../assets/file.jpg"  @dblclick="tab(scope.row)" />
                    </span>
                </template>
            </el-table-column>

            <el-table-column  label=文件名称 >
                <template slot-scope="scope">
                    <span v-if="status.includes('modified:   '+scope.row)"style="color: #E2C08D" >
                    {{scope.row}}
                    </span>
                    <span v-else-if="status.includes('deleted:    '+scope.row)" style="color: #F88070">
                    {{scope.row}}
                    </span>
                    <span v-else-if="status.includes(scope.row)" style="color:#F88070">
                    {{scope.row}}
                    </span>
                    <span v-else style="color:#73C991">
                    {{scope.row}}
                    </span>

                </template>
            </el-table-column>
            <el-table-column  label=文件状态 >
                <template slot-scope="scope">
                    <span v-if="status.includes('modified:   '+scope.row)"style="color: #E2C08D" >
                    修改未提交
                    </span>
                    <span v-else-if="status.includes('deleted:    '+scope.row)" style="color: #F88070">
                    {{scope.row}}
                    </span>
                    <span v-else-if="status.includes(scope.row)" style="color:#F88070">
                    新建未提交
                    </span>
                    <span v-else style="color:#73C991">
                    已提交GIT
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope" >
                    <el-dropdown>
                        <el-button >
                            <i class="el-icon-share"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                        <el-button size="mini" type="primary"  @click ="dangetijiao(scope.row)">上传文件<i class="el-icon-upload"></i></el-button>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-button size="mini" type="warning"    @click="showDrawer(scope.row)">回滚文件<i class="el-icon-upload"></i></el-button>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-button size="mini" type="success"    @click="showDrawere(scope.row)">版本对比 <i class="el-icon-d-arrow-right"></i></el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>








        <a-drawer title="历史版本" :width="520" placement="right" :closable="false" :visible="visible"
                :after-visible-change="afterVisibleChange" @close="onClose">
            <el-table :data="dangewenjianlishi" stripe style="width: 100%">
                <el-table-column prop="title" label="版本信息" ></el-table-column>
                <el-table-column prop="created_at" label="上传时间" ></el-table-column>
                <el-table-column prop="author_name" label="上传人"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger"   @click ="dangehuigun(scope.row.id)">回滚此版本</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </a-drawer>


<!--        单个文件的历史记录-->
<!--        <el-dialog title="历史版本" :visible.sync="dange" center>-->
<!--            <el-table :data="dangewenjianlishi" border style="width: 100%" >-->
<!--                <el-table-column prop="title" label="版本信息" ></el-table-column>-->
<!--                <el-table-column prop="created_at" label="上传时间" ></el-table-column>-->
<!--                <el-table-column prop="author_name" label="上传人" ></el-table-column>-->
<!--                <el-table-column label="操作">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="mini" type="danger"   @click ="dangehuigun(scope.row.id)">回滚此版本</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--            </el-table>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="dange= false">取 消</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->




        <a-drawer :width="520"
                title="版本对比"
                placement="right"
                :closable="false"
                :visible="visiblee"
                :after-visible-change="afterVisibleChangee"
                @close="onClosee"
        >

            <el-table :data="dangewenjianlishi" stripe style="width: 100%">
                <el-table-column prop="title" label="版本信息" ></el-table-column>
                <el-table-column prop="created_at" label="上传时间" ></el-table-column>
                <el-table-column prop="author_name" label="上传人"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span v-if="scope.$index==0">
                            <el-button size="mini" type="info" disabled  @click ="dangeduibi(scope.row.id)">当前版本</el-button>
                        </span>
                        <span v-else>
                            <el-button size="mini" type="danger"   @click ="dangeduibi(scope.row.id)">对比此版本</el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>

        </a-drawer>


  </div>






</template>
<script>







    import { exec } from 'child_process'
    import contextButton from '../components/index'



    var agent = navigator.userAgent.toLowerCase();
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);

    export default {
        name: "File",
        data () {
            return {
            visible: false,
            visiblee: false,
            url:'',
            token:'',
            //用户正在输入的值

            search: '',

            tree:[],
            name:'',
            id:'',
            file:[],
            caidan:[],
            //跟项目
            yiji:'',
            //当前目录的路径
            pwdw:[],
            //查看版本号
            banben:'',
            banben1:'',
            //分支数据
            list:[],
            //分支弹窗
            centerD:false,
            centerDDDD:false,
            dange:false,
            dangetanchuang:false,
            dangewenjian:'',
            dangewenjianlishi:[],
            selectionDatas:'',
            wenjianming:'',
            valuess:'',
            status:'',

            filepath:'',
            filename:'',

            zhuangtai:'',

            deletename:'',
            menuVisible: false,


            banbenduibi:'',
            dangqianbanbenid:''
            }
        },
        created(){
            this.test()

        },
        components: {
            contextButton
        },
        computed:{
            // 模糊搜索
            tables () {
                const search = this.search
                if (search) {
                    return this.file.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).toLowerCase().indexOf(search) > -1
                        })
                    })
                }
                return this.file
            },
        },

        methods: {
            afterVisibleChangee(val) {
                console.log('visiblee', val);
            },
            showDrawere(item) {
                this.visiblee = true;
                let that=this
                that.wenjianming=item
                let apiURL = this.url+'api/v4/projects/'+this.id+'/repository/commits?path='+item+'&private_token='+this.token
                this.$http.get(apiURL).then((response) => {
                    that.dangewenjianlishi=response.data;
                })
            },
            onClosee() {
                this.visiblee = false;
            },
            dangeduibi(id){
                let that=this
                that.banbenduibi=id

                const cmdStr = 'cd && cd '+that.name+' && git log -1 '+ that.wenjianming
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    console.log(data.replace(/\s*/g, ''))
                    var str = data.replace(/\s*/g, '')
                    that.dangqianbanbenid = str.match(/commit(\S*)Author:/)[1];
                    const cmd = 'cd && cd '+that.name+' && git difftool '+ that.banbenduibi +' '+ that.dangqianbanbenid+' '+ that.wenjianming
                    const worker = exec(cmd, {})
                    worker.stdout.on('data', function (data) {

                    })
                })

            },

            //文件历史版本
            afterVisibleChange(val) {
                console.log('visible', val);
            },
            showDrawer(item) {
                this.visible = true;
                let that=this
                that.wenjianming=item
                let apiURL = this.url+'api/v4/projects/'+this.id+'/repository/commits?path='+item+'&private_token='+this.token
                this.$http.get(apiURL).then((response) => {
                that.dangewenjianlishi=response.data;
                })
            },
            onClose() {
                this.visible = false;
            },

            test(){
                let that=this
                that.name = this.$route.params.name
                that.yiji =that.name
                that.id   =    this.$route.params.id
                that.url= localStorage.getItem("giturl")
                that.token= localStorage.getItem("tokens")
                let apiURL = this.url+'api/v4/projects/'+this.id+'/repository/tree/?private_token='+this.token
                this.$http.get(apiURL).then((response) => {
                    this.tree=response.data;
                })



                    const wuwu = 'cd &&cd '+this.name+'&& pwd'
                    const kuku = exec(wuwu, {})
                    kuku.stdout.on('data', function (data) {
                        console.log('stderr: ' + data)
                        //这里获取到当前项目的跟鹿筋
                        that.pwdw=data.substring(0, data.length - 1);
                        //将当前项目的跟路径赋值给导航栏
                        const cmdStr = 'cd '+that.pwdw+' && ls '
                        const workerProcess = exec(cmdStr, {})
                        workerProcess.stdout.on('data', function (data) {
                            console.log("原始数据"+data)
                            console.log("转为JSON对象数据"+JSON.stringify(data))
                            that.file=data.split('\n');
                            console.log("转为数组数据"+that.file)
                            that.file.pop();
                        })
                        setTimeout(that.statusss,1000)
                    })

            },
            deletes(item){
                let that=this
                const cmdStr ='cd '+that.pwdw+' && rm -r '+item
                that.deletename=item
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    console.log('stdout: ' + data)
                })

            },
            piliangshangchuan(){
                let that=this
                var arr=[];
                var data = this.$refs.multipleTable.selection;
                data.forEach(function(item){
                    arr.push(item)
                });
                console.log(arr)
                let permission = arr.join(",");
                let newMSG=permission.replace(","," ");
                this.$prompt('请输入本次提交的描述信息',  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '必须输入',
                }).then(({ value }) => {
                        that.valuess=value
                    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
                        //your code
                        alert("这是windows64位系统");
                        const cmd = 'cd.. &cd '+that.name+' & git branch'
                        const worker = exec(cmd, {})
                        worker.stdout.on('data', function (data) {
                            that.banben1=data.substr(1)
                            const cmdStr = 'cd.. &cd '+that.name+' & git add '+newMSG+' & git commit -m '+ value+' & git push origin '+that.banben1
                            const workerProcess = exec(cmdStr, {})
                            workerProcess.stdout.on('data', function (data) {})
                        })
                        this.$refs.multipleTable.clearSelection()
                        setTimeout(that.wenjianlog)
                    }
                    if(isMac){
                        //your code
                        alert("这是mac系统");
                        const cmd = 'cd &&cd '+that.name+' && git branch'
                        const worker = exec(cmd, {})
                        worker.stdout.on('data', function (data) {
                            that.banben1=data.substr(1)
                            const cmdStr = 'cd &&cd '+that.name+' && git add '+newMSG+' && git commit -m '+ value+' && git push origin '+that.banben1
                            const workerProcess = exec(cmdStr, {})
                            workerProcess.stdout.on('data', function (data) {})
                        })
                        this.$refs.multipleTable.clearSelection()
                        setTimeout(that.wenjianlog)
                    }


                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });


            },
            shezhi(){
                this.$router.push({
                    name: 'index',
                })
            },
            dangehuigun(id){
                    let that=this
                    this.dange=false
                    this.$prompt('请输入本次提交的描述信息',  {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /\S/,
                        inputErrorMessage: '必须输入',
                    }).then(({ value }) => {
                        that.valuess=value
                        const cmd = 'cd &&cd '+this.name+' && git reset '+id+' '+that.wenjianming +'&& git commit -m '+value+' && git checkout '+that.wenjianming+' && git push origin '+that.banben1
                        const worker = exec(cmd, {})
                        worker.stdout.on('data', function (data) {
                        })
                        this.visible =  false;
                        setTimeout(that.wenjianlog,2000)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消输入'
                        });
                    });
            },

            //提交单个文件文件后面的功能对应选择
            online(item){
                let that=this
                this.centerDDDD = true
                that.dangewenjian=item;

            },
            //已测试OK
            dangetijiao(item){
                //关闭上一层弹窗，
                this.centerDDDD=false
                let that=this
                that.dangewenjian=item
                this.$prompt('请输入本次提交的描述信息',  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '必须输入',
                }).then(({ value }) => {
                    that.valuess=value
                    const cmd = 'cd &&cd '+that.name+' && git branch'
                    const worker = exec(cmd, {})
                    worker.stdout.on('data', function (data) {
                       that.banben1=data.substr(1)
                        const cmdStr = 'cd &&cd '+that.name+' && git add '+  that.dangewenjian+' && git commit -m '+ value+' && git push origin '+that.banben1
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
            //文件的历史查询
            wenjianlog(){
                let that=this
                const cmdd = 'cd &&cd '+that.name+' && git log -1 '+that.dangewenjian
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
                this.$message.success('很高兴，处理成功');
            },
            successs() {
                this.$message.success('很抱歉，处理失败了');
            },



            //双击图片的进入的方法
            tab(item) {
                let that=this
                this.name = this.$route.params.name

                that.filename=item
                // 后缀获取
                var suffix = '';
                var flieArr = item.split('.');
                suffix = flieArr[flieArr.length - 1];
                //获取后缀名进行判断
                if(suffix=='txt'||suffix=='md'||suffix=='Zip'||suffix=='xls'||suffix=='doc'||
                    suffix=='jpg'||suffix=='png'||suffix=='svg'||suffix=='bmp'||suffix=='gif'||
                    suffix=='jpeg'||suffix=='heic'||suffix=='lock'||suffix=='xml'||suffix=='iml'||suffix=='cmd'||suffix=='md'){
                    const cmdStr ='cd '+that.pwdw+' && open '+item
                    const workerProcess = exec(cmdStr, {})
                    workerProcess.stdout.on('data', function (data) {
                        console.log('stdout: ' + data)
                    })
                    setTimeout(that.statusss)

                //    打开文件后，就调用文件监控状态
                    const cmdSt ='cd '+that.pwdw+' && pwd'
                    const workerProces = exec(cmdSt, {})
                    workerProces.stdout.on('data', function (data) {
                        that.filepath=data.replace(/(\s*$)/g,'');
                        console.log('stdout: ' + that.filepath)
                    })
                    setTimeout(that.filewatch)

                }else{
                    //如果上面判断不成立，那么他就是文件夹
                    const cmdStr = 'cd '+that.pwdw+' &&cd '+item+' && ls'
                    const workerProcess = exec(cmdStr, {})
                    workerProcess.stdout.on('data', function (data) {
                        if(data!=null){
                            that.file=data.split('\n');
                            that.file.pop()
                        }else{
                            // alert("没有数据")
                        }
                    })
                }
                //获取进入文件夹的当前路径
                const cmdStr = 'cd '+that.pwdw+' &&cd '+item+' && pwd'
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    that.pwdw=data.substring(0, data.length - 1);
                })
                //导航栏的数据
                const cmd = 'cd &&cd '+that.pwdw+' &&cd '+item+' && pwd'
                const w = exec(cmd, {})
                w.stdout.on('data', function (data) {
                    that.caidan=data.split('/');
                })
            },


            //点击切换到首页
            qiehuan(){
                this.$router.push({name:"demo"})
            },
            cyiji(yiji){
                let that=this
                const cmdStr = 'cd &&cd '+yiji+' && ls'
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    console.log('stderr: ' + data)
                        that.file=data.split('\n');
                        that.file.pop()
                    })
                const cmd = 'cd &&cd '+yiji+'&& pwd'
                const w = exec(cmd, {})
                w.stdout.on('data', function (data) {
                    that.caidan=data.split('/');
                    that.pwdw=data.substring(0, data.length - 1);
                })
            },
            //点击二级菜单的方法
            cerji(item){
                //收到页面传过来的值
                let that=this
                //首先获取页面穿过来的值的路径
                const cmdStr = 'cd &&cd '+this.name+' &&cd '+item+' && ls'
                // alert(cmdStr)
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    console.log('stderr: ' + data)
                    that.file=data.split('\n');
                    that.file.pop()
                })
                const cmd = 'cd &&cd '+this.name+' &&cd '+item+' && pwd'
                // alert(cmd)
                const w = exec(cmd, {})
                w.stdout.on('data', function (data) {
                    that.caidan=data.split('/');
                    that.pwdw=data.substring(0, data.length - 1);
                })
            },
            tijiao(){
                let that=this
                this.$prompt('请输入本次提交的描述信息',  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '必须输入',
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '提交成功版本信息为: ' + value,
                    });
                    const cmd = 'cd &&cd '+this.name+' && git branch'
                    const worker = exec(cmd, {})
                    worker.stdout.on('data', function (data) {
                        that.banben=data.split("*")[1]
                    })
                    const cmdStr = 'cd &&cd '+this.name+' && git add . && git commit -m '+value+' && git push origin '+that.banben
                    const workerProcess = exec(cmdStr, {})
                    workerProcess.stdout.on('data', function (data) {})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            statusss(){
                let that=this
                const cmd = 'cd &&cd '+this.name+' && git status'
                const worker = exec(cmd, {})
                worker.stdout.on('data', function (data) {
                    that.status=data
                })
            },
            // 监控文件
            filewatch(){
                let that=this
                const fs = require('fs')
                const filePath = this.filepath+'/'+this.filename
                console.log("路径是"+filePath)
                console.log(`正在监听 ${filePath}`);
                fs.watchFile(filePath, (cur, prv) => {
                        if(Date.parse(prv.ctime)==0){
                            console.log("文件被创建");
                        }else if(Date.parse(cur.ctime)==0){
                            console.log("文件被删除");
                            that.zhuangtai='删除'
                        }else if(Date.parse(cur.mtime)!=Date.parse(prv.mtime)){
                            console.log("文件被修改");
                            that.zhuangtai='修改'

                        }
                })
            },

            qie(name){
                const cmdStr = 'cd &&cd '+this.name+' && git checkout '+name
                const workerProcess = exec(cmdStr, {})
                this.centerD = false
                workerProcess.stdout.on('data', function (data) {

                })
            },

        },


        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            '$route': 'test',
        },
    }
</script>

<style scoped>
    .list li {float:left; display:inline; margin:5px;}

    #box ul{

    }
    #box li{
        padding: 15px;
        list-style: none;
        margin-right: 15px;
        text-align:center;


    }
    #box img{
        width: 50px;
        height:50px;
    }




    .on{
        width: 500px;
        height: 500px;
        margin: 150px auto 0;
    }
    .on img{
        transition: all 2s ease 0s;
    }
    /* transition 别放hover里，放到img里，这样移入移出一样缓慢，不然只对hover移上去有缓慢效果 */
    .on img:hover{
        transform: scale(1.2)

    }





</style>
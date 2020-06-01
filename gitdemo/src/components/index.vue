<template>
    <div>
        <el-button type="text"    @click="fanhui" >返回首页 </el-button>
        <el-button type="text"    @click="ceshi" >测试</el-button>
        <div v-html="prettyHtml" />



    </div>
</template>

<script>
    //将获取到的版本差异展示在页面中
    import * as Diff2Html from 'diff2html';
    import 'diff2html/bundles/css/diff2html.min.css';
    import { exec } from 'child_process'
    export default {
        name: "index",
        data () {
            return {
                diffs:
                    ''
                     }　
        },
        computed: {
            prettyHtml() {
                return Diff2Html.html(this.diffs, {
                    drawFileList: true,
                    matching: 'lines',
                    outputFormat: 'side-by-side',
                });
            },
        },
        methods: {
            fanhui(){
                this.$router.push({
                    name: 'file',
                })
            },
            ceshi(){
                let that=this
                const cmdStr = 'cd &&cd wuwuwu && git diff b602bd52ea904773eb2305609bf385d6e9cac7c4 8300c651265806a8a50bc1b0be883ae420a4bb6a 对比.docx '
                alert(that.diffs)
                const workerProcess = exec(cmdStr, {})
                workerProcess.stdout.on('data', function (data) {
                    that.diffs=data
                    alert(that.diffs)
                })
            },



        }
    }
</script>

<style scoped>


</style>
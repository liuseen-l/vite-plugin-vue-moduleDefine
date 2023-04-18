import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})

/**
 * 思路
 *  1.传入会被分割的vue文件
 *  2.当访问到这些vue文件的时候去匹配非相对导入的import
 *  3.在这些文件当中扫描是否含有defineProps的定义
 *  4.如果含有，将其标记为需要进行替换的文件
 *  5.最后提取内容，合并defineProps,以及方法重名的避免
 *  6.因此这个插件的执行时间需要在vue插件之前
 * 
 *  插件执行顺序，不是一个一个插件各个钩子走完再执行下一个钩子，比如
 *  插件1（load1，transform1） 插件2（load2，transform2）
 *  
 *  错误： load1 -> transform1 -> load2 -> transform2
 * 
 *  正确： load1 -> load2 -> transform1 -> transform2
 */

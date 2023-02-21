/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-21 02:14:44
 * @FilePath: \site\js\import\NML\Config__NML.js
 * @Description: Nittle Math Library's Config
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {number} int      整形数字 */
    /*h*//** @typedef {number} double   双浮点数字 */
    /*h*//** @typedef {number} float    单浮点数字 */
    /*h*//** @typedef {number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

// open * 配置/基础 * open

    /**
     * @typedef Config__NML NML 的配置参数对象
     * @property {Float32ArrayConstructor|Float64ArrayConstructor} VALUE_TYPE 向量使用的数据类型; 可选值为 {Float32Array, Float64Array}, 默认为 Float32Array
     * @property {float} APPROXIMATELY_TOLERANCE 计算容差 默认为 1e-6
     * @property {int} COORDINATE_SYSTEM 坐标系 [左手系,右手系] (默认为0 左手系)
     */
    
    /** @type {Config__NML} 配置 */
    const CONFIG=Object.assign({
        VALUE_TYPE:                Float32Array,
        APPROXIMATELY_TOLERANCE:   0,
        COORDINATE_SYSTEM:         globalThis.CONFIG__NML.VALUE_TYPE===Float32Array?1e-6:1e-15
    },globalThis.CONFIG__NML);

    function acos__Safe(value){
        if(value<=-1.0){
            return Math.PI;
        }
        if(value>=1.0){
            return 0.0
        }
        return Math.acos(value)
    }
    //```
    const {sin,cos,asin,acos,abs,sqrt,tan}=Math;
    const SAFE_MATH_TOOLS={
        sin:Math.sin,
        cos:Math.cos,
        asin:Math.asin,
        acos:acos__Safe,
        abs:Math.abs,
        sqrt:Math.sqrt,
        tan:Math.tan,
        atan:Math.atan,
        atan2:Math.atan2
        },
        DEG     = globalThis.DEG    = Math.DEG = Math.PI/180,
        DEG_90  = Math.PI*0.5,
        DEG_180 = Math.PI,
        CYCLES  = globalThis.CYCLES = Math.PI*2;
    //```

    /** 近似相等, 用于浮点误差计算后判断结果是否相近; 
     * @param {number} num1 数字
     * @param {number} num2 数字
     * @param {number} _tolerance 容差 默认为 CONFIG.APPROXIMATELY_TOLERANCE (1e-12)
     * @return {boolean} 返回数值是否相近
     */
    function approximately(num1,num2,_tolerance){
        return Math.abs(num1-num2)<(_tolerance===undefined?CONFIG.APPROXIMATELY_TOLERANCE:_tolerance);
    }

    /** 数值数组近似相等
     * @param {number[]} arr1 数组1
     * @param {number[]} arr2 数组2
     * @param {number} _tolerance 容差 默认为 CONFIG.APPROXIMATELY_TOLERANCE (1e-12)
     * @return {boolean} 返回 !(左右两数组是否有不相近的数值对)
     */
    function approximately__Array(arr1,arr2,_tolerance){
        var i =arr1.length;
        if(i!==arr2.length){
            return false;
        }
        for(--i;i>=0;--i){
            if(abs(arr1[i]-arr2[i])>(_tolerance||CONFIG.APPROXIMATELY_TOLERANCE)){
                return false
            }
        }
        return true;
    }
    
    
    /** 向数组写入数据
     * @param {List_Value} out 输出对象
     * @param {List_Value} org 数据来源
     * @param {int} [_l]   写入长度
     * @return {List_Value} 修改并返回 out
     */
    function copy_Array(out,org,_l){
        var i=_l||(out.length>org.length?org.length:out.length);
        do{
            --i;
            out[i]=org[i];
        }while(i);
        return out;
    }
// end  * 配置/基础 * end 

// open * 注入到全局 * open
    //```
    Object.assign(globalThis,{
        DEG,
        DEG_90,
        DEG_180,
        CYCLES,
        copy_Array,
        approximately,
        CONFIG__NML:CONFIG
    });
    //```
// end  * 注入到全局 * end 

//# 导出
export{
    CONFIG,
    DEG,
    DEG_90,
    DEG_180,
    CYCLES,
    copy_Array,
    approximately,
    approximately__Array,
    SAFE_MATH_TOOLS
}
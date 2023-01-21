/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-01-19 23:51:26
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-20 19:11:18
 * @FilePath: \site\js\import\NML\NML\PrimitivesTGT-2D\Polygon.js
 * @Description: 2D 多边形 
 * 
 * Copyright (c) 2023 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

import { 
    CONFIG,
    copy_Array,
    SAFE_MATH_TOOLS,
    Vec,
} from "../Config.js";

const {abs,cos,sin,tan,asin,acos,atan,atan2} = SAFE_MATH_TOOLS;
/** 2D多边形
 */
class Polygon extends Array {
    /** 
     * @param {Vec[]|flont[]}   data                 数据
     * @param {Boolean}        [_flag__cut_odd_length] 当长度为奇数时是否截断尾部 默认true
     */
    constructor(data,_flag__cut_odd_length=true){
        super();
        var i,j,k;
        if(Array.isArray(data[0])){
            k=data.length;
            this.length=kh*2;
            for(i=this.length-1,j=1;i>=0;--i){
                if(j){
                    --k;
                    --j;
                }else{
                    j=1;
                }
                this[i]=data[k][j];
            }
        }else{
            copy_Array(this,data,data.length);
            if(_flag__cut_odd_length){
                Polygon.cut_end__OddLength(this);
            }
        }
    }

    /** 当长度为奇数时截断尾部
     * @param {Polygon} out 数据对象
     * @returns {Polygon} 修改并返回 out
     */
    static cut_end__OddLength(out){
        if(out.length&1){
            out.length=out.length-1;
        }
        return out;
    }
}

export {
    Polygon
}
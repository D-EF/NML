/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-12-24 23:15:02
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-01-04 00:35:05
 * @FilePath: \site\js\import\NML\test\base__test.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/** 参数遇到 false 时抛出异常 */
function callback_ClacErr__Throw(...arg){
    if(arg.includes(false)||arg.includes(undefined)||arg.includes(null)){
        throw new Error("Bad calc!");
    }
    return arg;
}


/** 参数遇到 false 时打印错误 */
function callback_ClacErr__ErrLog(...arg){
    if(arg.includes(false)||arg.includes(undefined)||arg.includes(null)){
        console.error("Bad calc!");
    }
    return arg;
}

export{
    callback_ClacErr__Throw,
    callback_ClacErr__ErrLog
}
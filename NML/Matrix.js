/*
* @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:41:34
 * @FilePath: \site\js\import\NML\NML\Matrix.js
 * @Description: 通用矩阵
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/*h*/// open * 类型注释 * open
    /*h*//** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /*h*//** @typedef {Number} int      整形数字 */
    /*h*//** @typedef {Number} double   双浮点数字 */
    /*h*//** @typedef {Number} float    单浮点数字 */
    /*h*//** @typedef {Number[]|Float32Array|Float64Array} List_Value 数据的各种存储形式 */
/*h*/// end  * 类型注释 * end

import {copy_Array,approximately,CONFIG, SAFE_MATH_TOOLS} from "./Config.js";
import {Vector} from "./Vector.js";
/*h*/const {sin,cos,asin,acos,abs,sqrt,tan}=SAFE_MATH_TOOLS;

/** 矩阵
 * 矩阵的数据类型为1维线性表:
 * ```
 * [1, 2, 3]
 * [4, 5, 6]  >>  [1,2,3,4,5,6,7,8,9]
 * [7, 8, 9]
 * ```
 */
class Matrix extends CONFIG.VALUE_TYPE{
    // 继承使用 CONFIG.VALUE_TYPE 的构造函数

    /** 创建打印用的二维数组
     * @param {List_Value} mat 矩阵
     * @param {int} width 矩阵有多少列(宽度)
     * @return {Number[][]} 
     */
    static create_Print(mat,width){
        var l=mat.length,i,
            n=parseInt(width||parseInt(sqrt(l)));
        var rtn=[];
        i=0;
        do{
            rtn.push(mat.slice(i,i+=n));
        }while(i<l);
        return rtn;
    }

    /** 校验矩阵是否为方阵
     * @param {List_Value} mat    矩阵
     * @param {int} [_n]    n阶矩阵
     * @return {int} 返回 n
     * @throws {Error} 当 n 和 m 的长度 无法形成方阵时 将会抛出异常
     */
    static check_Square(mat,_n){
        var n=parseInt(_n||sqrt(mat.length));
        if(n*n!==mat.length) throw new Error("This is not a square matrix! It should be a (n*n)!");
        return n;
    }

    /** 判断两个矩阵是否相等 (允许误差)
     * @param {Matrix} mat1 
     * @param {Matrix} mat2 
     */
    static check_Equal(mat1,mat2){
        var i=mat1.length;
        if(i===mat2.length)do{
            --i;
            if(!approximately(mat1[i],mat2[i]))return false;
        }while(i);
        else return false;
        return true
    }

    /** 根据原矩阵创建新的矩阵, 可以改变矩阵的宽高, 在空的地方会写入单位矩阵的数据 
     * ```
     * create_NewSize([1,2,3,4],2,3);    create_NewSize([1,2,3,4],2,3,2,3,2,1);
     * // [1,2]    [1,2,0]               // [1,2]    [1,0,0]
     * // [3,4] >> [3,4,0]               // [3,4] >> [0,1,0] 
     * //          [0,0,1]               //          [0,1,1]
     * ```
     * @param {Matrix} mat    原矩阵
     * @param {int} low_width           原矩阵宽度
     * @param {int} new_width           新矩阵宽度
     * @param {int} [_low_hight]        原矩阵高度 无输入时将使用 low_w
     * @param {int} [_new_hight]        新矩阵高度 无输入时将使用 new_w
     * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0
     * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left
     * @return {Matrix} 返回一个新矩阵
     */
    static create_NewSize(mat,low_width,new_width,_low_hight,_new_hight,_shift_left,_shift_top){
        var rtn=Matrix.create_Identity(new_width,_new_hight);
        return Matrix.setup(rtn,mat,low_width,new_width,_low_hight,_new_hight,_shift_left,_shift_top);
    }


    /** 矩阵数据转移 空省位置会保留out的内容
     * @param {Matrix} out        数据输出对象(要写入的矩阵)
     * @param {Matrix} mat        数据来源矩阵
     * @param {int} low_width     原矩阵宽度
     * @param {int} new_width     新矩阵宽度
     * @param {int} [_low_hight]  原矩阵高度 无输入时将使用 low_w
     * @param {int} [_new_hight]  新矩阵高度 无输入时将使用 new_w
     * @param {int} [_shift_left] 旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0
     * @param {int} [_shift_top]  旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left
     * @return {Matrix} 修改 out 并返回
     */
    static setup(out,mat,low_width,new_width,_low_hight,_new_hight,_shift_left,_shift_top){
        var low_hight  = _low_hight||low_width,new_h=_new_hight||new_width,
            shift_top  = (_shift_top&&((new_width+_shift_top)%new_width))||0,
            shift_left = _shift_left===undefined?shift_top:((new_h+_shift_left)%new_h),
            length     = new_width*new_h,
            temp_u,temp_v,u,v,
            i;
        u=new_width-1;
        v=new_h-1;
        temp_u=u-shift_left;
        temp_v=v-shift_top;
        for(i=length-1;i>=0;--i){
            if(!(temp_u>=low_width||temp_v>=low_hight)){
                out[i]=mat[temp_v*low_width+temp_u];
            }
            --u;
            --temp_u;
            if(temp_u<0)temp_u=new_width-1;
            if(u<0){
                u=new_width-1;
                --v;
                --temp_v;
                if(temp_v<0)temp_v=new_h-1;
            }
        }
        return out;
    }

    /** 计算张量积
     * @param {List_Value} mat_left 矩阵1
     * @param {List_Value} mat_right 矩阵2
     * @param {int} [_width_left] 矩阵1的宽度 默认认为 m1 是列向量(w1=1)
     * @param {int} [_hight1] 矩阵1的高度 默认认为 m1 是列向量(h1=m1.length)
     * @param {int} [_width_right] 矩阵2的宽度 默认认为 m2 是行向量(w2=m2.length)
     * @param {int} [_hight2] 矩阵2的高度 默认认为 m2 是行向量(h2=1)
     * @return {Matrix} 返回一个新的矩阵
     */
    static create_TensorProduct(mat_left,mat_right,_width_left,_hight1,_width_right,_hight2){
        var width_left=_width_left||1,
            height_left=_hight1||mat_left.length,
            width_right=_width_right||mat_right.length,
            height_right=_hight2||1,
            i=width_left*height_left;
        var rtn=new Array(i);
        for(--i;i>=0;--i){
            rtn[i]=Matrix.np(mat_right,mat_left[i]||0);
        }
        return Matrix.concat(rtn,width_left,width_right,height_left,height_right);
    }

    /** 合并矩阵
     * @param  {List_Value[]} m_list 传入多个矩阵,矩阵应该拥有相同大小
     * @param  {int} list_width      m_list中一行放几个矩阵
     * @param  {int} mat_width      m_list[i]的宽度
     * @param  {int} [_list_height]   m_list中一列放几个矩阵
     * @param  {int} [_mat_height]   m_list[i]的高度
     * @return {Matrix} 返回一个新的矩阵
     * ```javascript
     *    Matrix.create_Concat([[1,2,3,4], [5,6,7,8]], 2, 2);
     *    // [1,2]   [5,6] >> [1,2,5,6] >> [1,2,5,6,3,4,7,8]
     *    // [3,4] , [7,8]    [3,4,7,8]
     * ```
     */
    static concat(m_list,list_width,mat_width,_list_height,_mat_height){
        var list_height=_list_height||Math.ceil(m_list.length/list_width),
            mat_height=_mat_height||Math.ceil(m_list[0].length/mat_width),
            list_length=list_width*list_height,
            mat_length=mat_width*mat_height,
            length=list_length*mat_length,
            width=list_width*mat_width,
            u_list,v_list,u,v,
            i,j,k;
        var rtn=new Matrix(length);
        k=list_length;
        for(v_list=list_height-1;v_list>=0;--v_list){
            for(u_list=list_width-1;u_list>=0;--u_list){
                --k;
                j=mat_length;
                for(v=mat_height-1;v>=0;--v){
                    i=(v_list*mat_height+v)*width+mat_width*(u_list+1);
                    if(m_list[k])
                    for(u=mat_width-1;u>=0;--u){
                        --i;
                        --j;
                        rtn[i]=m_list[k][j];
                    }
                }        
            }
        }
        return rtn;
    }

    /** 矩阵乘标量
     * @param {List_Value}     mat   矩阵
     * @param {Number}  k   标量
     * @return {Matrix} 返回一个新的矩阵
     */
    static np(mat,k){
        return Matrix.np_b(new Matrix(mat),k);
    }

    /** 矩阵乘标量
     * @param {List_Value}     mat   矩阵
     * @param {Number}  k   标量
     * @return {List_Value} 修改m并返回
     */
    static np_b(mat,k){
        var i;
        for(i=mat.length-1;i>=0;--i){
            mat[i]*=k;
        }
        return mat;
    }

    /** 使用 uv 获取 index 
     * @param {int} width 矩阵宽度 (列数)
     * @param {int} u 元素的 u 坐标 (第u列)
     * @param {int} v 元素的 v 坐标 (第v行)
     */
    static get_Index(width,u,v){
        return v*width+u;
    }

    /** 创建单位矩阵
     * @param {int}  width   矩阵宽度
     * @param {int} [_height]  矩阵高度 默认和 w 相等
     * @return {Matrix} 
     */
    static create_Identity(width,_height){
        var height=_height||width;
        var length=width*height,
            step_length=width+1,
            i=0,j=width>height?height:width;
        var rtn=new Matrix(length);
        do{
            rtn[i]=1.0;
            i+=step_length;
            --j
        }while(j>0);
        return rtn;
    }
    
    /** 初等变换 换行操作
     * @param {List_Value|List_Value[]} mat 一个或多个矩阵
     * @param {int} n       n阶矩阵 用来表示一行的长度
     * @param {int} v1      矩阵v坐标1 (要对调的行下标1)
     * @param {int} v2      矩阵v坐标2 (要对调的行下标2)
     * @return {m} 修改并返回m
     */
    static transform_Exchange(mat,n,v1,v2){
        var i,j,k,t,temp;
        var f=ArrayBuffer.isView(mat[0])||Array.isArray(mat[0]);
        // 换行
        for(i=v1*n,j=v2*n,k=n; k>0; --k,++i,++j){
            if(f){
                for(t=mat.length-1;t>=0;--t){
                    temp=mat[t][i];
                    mat[t][i]=mat[t][j];
                    mat[t][j]=temp;  
                }
            }else{
                temp=mat[i];
                mat[i]=mat[j];
                mat[j]=temp;
            }
        }
        return mat;
    }

    /** 初等变换 某行乘标量
     * @param {List_Value|List_Value[]} mat     矩阵
     * @param {int} n           n阶矩阵
     * @param {int} v           矩阵的v坐标(行下标)
     * @param {Number} k    乘法中的标量部分
     */
    static transform_multiplication(mat,n,v,k){
        var i,j,t;
        var f=ArrayBuffer.isView(mat[0])||Array.isArray(mat[0]);
        // 换行
        if(f){
            for(i=v*n,k=n; k>0; --k,++i){
                for(t=mat.length-1;t>=0;--t) mat[t][j]*=k;  
            }
        }else{
            for(i=v*n,k=n; k>0; --k,++i) mat[j]*=k;
        }
        return mat;
    }
    
    /** 将矩阵某个为0的项 通过初等变换的换行操作, 变成非0
     * @param {List_Value|List_Value[]} m     一个或多个矩阵
     * @param {int} index       当前下标
     * @param {int} v           当前v坐标(行下标)
     * @param {int} step_length 寻址步长,应为 ±n
     * @param {int} [_index_m]  传入多个矩阵时使用哪个矩阵的值 默认0
     * @return {Matrix} 
     */
    static exchange_zero(m,index,v,step_length,_index_m){
        if(!step_length) return m;
        var _v=v,i;
        var f=step_length>0?1:-1;
        var tm=(ArrayBuffer.isView(m[0])||Array.isArray(m[0]))?m[_index_m||0]:m;
        for(i=index;tm[i]!==undefined;i+=step_length,_v+=f){
            if(tm[i]){
                if(_v===v)  return m;
                else        return Matrix.transform_Exchange(m,Math.abs(step_length),_v,v);
            }
        }
        // 找不到可以替换的
        return m;
    }

    /** 矩阵乘法    如果不传入矩阵宽高信息将视为方阵
     * @param {List_Value} mat_left 左矩阵
     * @param {List_Value} mat_right 右矩阵
     * @param {int} [_height_left]   左矩阵的行数(高度)
     * @param {int} [_width_left_height_right] 左矩阵的列数(宽度) 与 右矩阵的行数(高度)
     * @param {int} [_width_right]   右矩阵的列数(宽度)
     * @return {Matrix} 返回一个新的矩阵
     */
    static multiplication(mat_left,mat_right,_height_left,_width_left_height_right,_width_right){
        var n=_height_left||_width_left_height_right||_width_right;
        if(!n){
            n=Matrix.check_Square(mat_left);
            Matrix.check_Square(mat_right,n);
        }
        var height_left=_height_left||n,
            width_left_height_right=_width_left_height_right||n,
            width_right=_width_right||n;
            
        if(height_left<=0&&width_left_height_right<=0&&width_right<=0) throw new Error ("had null matrix in param!");

        var length=width_right*height_left, index_mat_left, index_mat_right, index_rtn, u, v, i;
        var rtn=new Matrix(length);
        
        for(v=height_left-1;v>=0;--v){
            for(u=width_right-1;u>=0;--u){
                index_mat_left=v*width_left_height_right;
                index_mat_right=u;
                index_rtn=v*width_right+u;
                for(i=width_left_height_right;i>0;--i,++index_mat_left,index_mat_right+=width_right){
                    rtn[index_rtn]+=mat_left[index_mat_left]*mat_right[index_mat_right]
                }
            }
        }
        return rtn;
    }
    
    /** 检查矩阵正交
     * @param {Matrix} mat    矩阵
     * @param {Matrix} [_n] n阶矩阵
     * @return {Boolean}
     */
    static check_Orthogonal(mat,_n){
        var n=Matrix.check_Square(mat,_n);
        var rows=new Array(n);
        var i,j;
        for(i=n-1;i>=0;--i){
            rows[i]=new Vector(n);
            for(j=n-1;j>=0;--j){
                rows[i][j]=mat[3*i+j];
            }
        }
        var f=true;
        for(i=n-1;f&&(i>=0);--i){
            for(j=n-1;f&&(j>=0);--j){
                f=approximately(Vector.dot(rows[i],rows[j]),i===j?1:0);
            }
        }
        return f;
    }

    /** 矩阵转置
     * @param {List_Value} out 矩阵
     * @param {int} [_width] 矩阵宽度(列数)
     * @param {int} [_height] 矩阵高度(行数)
     * @return {m} 修改mat并返回
     */
    static transpose(out,_width,_height){
        var u, v, point_u, point_v, temp;
        var n=_width||Matrix.check_Square(out,_n);
        if(n===(_height||n)){  //方阵
            for(v=n-1; v>0; --v){
                for(u=v-1; u>=0; --u){
                    point_u=v*n+u;
                    point_v=u*n+v;
                    temp=out[point_v];
                    out[point_v]=out[point_u];
                    out[point_u]=temp;
                }
            }
        }else{
            point_u=out.length
            temp=new Array(out.length);
            for(--point_u,v=_width-1,u=_height-1;point_u>=0;--point_u,--u){
                if(u===-1){
                    u=_height-1;
                    --v;
                }
                temp[point_u]=out[u*_width+v]
            }
            u=out.length-1;
            do{
                out[u]=temp[u];
                --u;
            }while(u>=0)
        }
        return out;
    }

    /** 创建矩阵的转置
     * @param {List_Value} mat 矩阵
     * @param {int} [_n] 矩阵为n阶矩阵
     * @return {m} 返回一个新的矩阵
     */
    static create_Transposed(mat,_n){
        return Matrix.transpose(new Matrix(mat),_n);
    }
    
    /** 计算矩阵行列式
     * @param {List_Value} mat 矩阵
     * @param {int} [_n] 矩阵为n阶矩阵
     * @return {Number} 返回矩阵的行列式
     */
    static calc_Det(mat,_n){
        switch(mat.length){

            case 1: return  mat[0];
            break;

            case 4: return  mat[0]*mat[3]-mat[1]*mat[2];
            break;

            case 9: return  mat[0] * (mat[4]*mat[8] - mat[5]*mat[7])+
                            mat[1] * (mat[5]*mat[6] - mat[3]*mat[8])+
                            mat[2] * (mat[3]*mat[7] - mat[5]*mat[6]);
            break;

            case 16:
                var t0  = mat[0]  * mat[5]  - mat[1]  * mat[4],
                    t1  = mat[0]  * mat[6]  - mat[2]  * mat[4],
                    t2  = mat[0]  * mat[7]  - mat[3]  * mat[4],
                    t3  = mat[1]  * mat[6]  - mat[2]  * mat[5],
                    t4  = mat[1]  * mat[7]  - mat[3]  * mat[5],
                    t5  = mat[2]  * mat[7]  - mat[3]  * mat[6],
                    t6  = mat[8]  * mat[13] - mat[9]  * mat[12],
                    t7  = mat[8]  * mat[14] - mat[10] * mat[12],
                    t8  = mat[8]  * mat[15] - mat[11] * mat[12],
                    t9  = mat[9]  * mat[14] - mat[10] * mat[13],
                    t10 = mat[9]  * mat[15] - mat[11] * mat[13],
                    t11 = mat[10] * mat[15] - mat[11] * mat[14];
                
                return t0 * t11 - t1 * t10 + t2 * t9 + t3 * t8 - t4 * t7 + t5 * t6;
            break;

            default:
                return Matrix.calc_Det__Transform(mat,_n);
            break;
        }
    }

    /** 计算矩阵行列式 --使用初等变换
     * @param {List_Value} mat 矩阵
     * @param {int} [_n] 矩阵为n阶矩阵
     * @return {Number} 返回矩阵的行列式
     */
    static calc_Det__Transform(mat,_n){
        var n, uv, index_mat__uv, i, j, flag=1;
        var k, sp;
        var mat__transform, temp_row;
        n=Matrix.check_Square(mat,_n);
        mat__transform=new Matrix(mat);
        for(uv=n-1; uv>0; --uv){
            index_mat__uv=uv*n+uv;
            if(!mat__transform[index_mat__uv]){
                // 换行
                Matrix.exchange_zero(mat__transform,index_mat__uv,uv,-n);
                if(!mat__transform[index_mat__uv])return 0;
                else flag*=-1;
            }
            temp_row=mat__transform.slice(index_mat__uv-uv,index_mat__uv);
            // 单位化
            if(!(mat__transform[index_mat__uv]===1)){
                sp=1/(mat__transform[index_mat__uv]);
                i = uv;
                for(--i; i>=0; --i){
                    temp_row[i]*=sp;
                }
            }
            // 消元
            for(index_mat__uv-=n;index_mat__uv>=0;index_mat__uv-=n){
                k=mat__transform[index_mat__uv];
                if(k===0)continue;
                for(i=uv,j=index_mat__uv; i>=0; --i,--j){
                    mat__transform[j]-=k*[temp_row[i]];
                }
            }
        }
        for(sp=1,j=mat__transform.length-1; j>=0; j-=n+1){
            sp*=mat__transform[j];
        }
        return sp*flag;
    }

    /** 变换得到矩阵逆 高斯乔丹消元法(初等变换法)
     * @param {List_Value} mat 传入矩阵, 计算完后将会变成单位矩阵
     * @param {int} [_n]     矩阵为n阶矩阵
     * @return {Matrix}      返回一个新的矩阵
     */
    static create_Inverse__Transform(mat,_n){
        var n,uv,index_mat__uv,i,j,v,temp;
        var k,sp;
        var _m=[];

        n=Matrix.check_Square(mat,_n);
        _m[0]=mat;
        _m[1]=Matrix.create_Identity(n);
        
        for(uv=n-1; uv>=0; --uv){
            index_mat__uv=uv*n+uv;
            if(!_m[0][index_mat__uv]){
                // 换行
                Matrix.exchange_zero(_m,index_mat__uv,uv,-n);
                if(!_m[0][index_mat__uv]){
                    console.warn("This is a singular matrix!");
                    return mat;
                }
            }
            k=index_mat__uv-uv;
            // 单位化
            if(!(_m[0][index_mat__uv]===1)){
                sp=1/(_m[0][index_mat__uv]);
                for(i = n-1; i>=0; --i){
                    _m[0][k+i]*=sp;
                    _m[1][k+i]*=sp;
                }
            }
            // 消元
            for(v=n-1,index_mat__uv=v*n+uv;index_mat__uv>=0;--v,index_mat__uv=v*n+uv){
                k=_m[0][index_mat__uv];
                if((k===0)||(uv===v))continue;
                temp=n*uv;
                for(i=n-1,j=(v+1)*n-1; i>=0; --i,--j){
                    if(i<=uv)_m[0][j]-=k*_m[0][temp+i];
                    _m[1][j]-=k*_m[1][temp+i];
                }
            }
        }
        return _m[1];
    }

    /** 求矩阵的逆 (创建逆矩阵)
     * @param {List_Value} mat       矩阵
     * @param {int} [_n]    矩阵为n阶矩阵
     * @return {Matrix|null}     返回一个新的矩阵
     */
    static create_Inverse(mat,_n){
        // 公式法 m^-1=adj(m)/|m|
        switch (mat.length) {
            case 1:
                return new Matrix([1/mat[0]]);
            break;
            
            case 4:
                var d = Matrix.calc_Det(mat);
                if(approximately(d,0))return null;
                d=1/d;
                return new Matrix([
                        mat[3]*d, -mat[1]*d,
                    -mat[2]*d,  mat[0]*d,
                ]);
            break;
            
            case 9:
                var d = Matrix.calc_Det(mat);
                if(approximately(d,0))return null;
                d=1/d;
                return new Matrix([
                    (mat[4]*mat[8]-mat[7]*mat[5])*d,    (mat[3]*mat[8]-mat[6]*mat[5])*d,    (mat[3]*mat[7]-mat[6]*mat[4])*d,
                    (mat[1]*mat[8]-mat[7]*mat[2])*d,    (mat[0]*mat[8]-mat[6]*mat[2])*d,    (mat[0]*mat[7]-mat[6]*mat[1])*d,
                    (mat[1]*mat[5]-mat[4]*mat[2])*d,    (mat[0]*mat[5]-mat[3]*mat[2])*d,    (mat[0]*mat[4]-mat[3]*mat[1])*d,
                ]);
            break;
            
            case 16:
                var t00 = mat[0]  * mat[5]  - mat[1]  * mat[4],
                    t01 = mat[0]  * mat[6]  - mat[2]  * mat[4],
                    t02 = mat[0]  * mat[7]  - mat[3]  * mat[4],
                    t03 = mat[1]  * mat[6]  - mat[2]  * mat[5],
                    t04 = mat[1]  * mat[7]  - mat[3]  * mat[5],
                    t05 = mat[2]  * mat[7]  - mat[3]  * mat[6],
                    t06 = mat[8]  * mat[13] - mat[9]  * mat[12],
                    t07 = mat[8]  * mat[14] - mat[10] * mat[12],
                    t08 = mat[8]  * mat[15] - mat[11] * mat[12],
                    t09 = mat[9]  * mat[14] - mat[10] * mat[13],
                    t10 = mat[9]  * mat[15] - mat[11] * mat[13],
                    t11 = mat[10] * mat[15] - mat[11] * mat[14];
                
                var d=t00*t11-t01*t10+t02*t09+t03*t08-t04*t07+t05*t06;
                if(approximately(d,0))return null;
                d=1/d;

                return new Matrix([
                    (mat[5]*t11-mat[6]*t10+mat[7]*t09)*d,    (mat[2]*t10-mat[1]*t11-mat[3]*t09)*d,    (mat[13]*t05-mat[14]*t04+mat[15]*t03)*d,    (mat[10]*t04-mat[9] *t05-mat[11]*t03)*d,
                    (mat[6]*t08-mat[4]*t11-mat[7]*t07)*d,    (mat[0]*t11-mat[2]*t08+mat[3]*t07)*d,    (mat[14]*t02-mat[12]*t05-mat[15]*t01)*d,    (mat[8] *t05-mat[10]*t02+mat[11]*t01)*d,
                    (mat[4]*t10-mat[5]*t08+mat[7]*t06)*d,    (mat[1]*t08-mat[0]*t10-mat[3]*t06)*d,    (mat[12]*t04-mat[13]*t02+mat[15]*t00)*d,    (mat[9] *t02-mat[8] *t04-mat[11]*t00)*d,
                    (mat[5]*t07-mat[4]*t09-mat[6]*t06)*d,    (mat[0]*t09-mat[1]*t07+mat[2]*t06)*d,    (mat[13]*t01-mat[12]*t03-mat[14]*t00)*d,    (mat[8] *t03-mat[9] *t01+mat[10]*t00)*d
                ]);
            break;
            
            default:
                // 高斯乔丹消元法(初等变换法)
                return Matrix.create_Inverse__Transform(new Matrix(mat),_n);
            break;
        }
        
    }
}

//# 导出
export{
    Matrix
}
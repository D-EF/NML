/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-10-24 00:07:09
 * @FilePath: \site\js\import\NML\NML.js
 * @Description: Nittle Math Library
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

// open * 配置/基础 * open
    /** @typedef {Float32Array} globalThis.NML_VALUE_TYPE */
    globalThis.NML_VALUE_TYPE=globalThis.NML_VALUE_TYPE||Float32Array;
    /** @type {Object} 配置 */
    const CONFIG={
        /** 向量使用的数据类型; 可选值为 Float32Array, Float64Array */
        VALUE_TYPE:globalThis.NML_VALUE_TYPE,
        /** @type {float} 计算容差 */
        APPROXIMATELY_TOLERANCE:1e-6
    };
    //```
    const {sin,cos,asin,acos,abs,sqrt,tan}=Math,
        /**/    DEG     = globalThis.DEG    = Math.DEG = Math.PI/180,
        /**/    DEG_90  = 90*DEG,
        /**/    DEG_180 = 180*DEG,
        /**/    CYCLES  = globalThis.CYCLES = Math.PI*2;
    //```

    /** 近似相等, 用于浮点误差计算后判断结果是否相近; 
     * @param {Number} num1 数字
     * @param {Number} num2 数字
     * @param {Number} tolerance 容差， 默认为 1e-12
     */
    function approximately(num1,num2,tolerance){
        return Math.abs(num1-num2)<(tolerance||1e-12);
    }
    /** 向数组写入数据
     * @param {List_Value} rtn 输出对象
     * @param {List_Value} org 数据来源
     * @param {int} [_l]   写入长度
     * @return {List_Value} 修改并返回 out
     */
    function copy_Array(rtn,org,_l){
        var i=_l||(rtn.length>org.length?org.length:rtn.length);
        do{
            --i;
            rtn[i]=org[i];
        }while(i);
        return rtn;
    }
// end  * 配置/基础 * end 

// open * 类型注释 * open
    /** @typedef {Float32Array} CONFIG.VALUE_TYPE 矩阵计算时缓存下标的类型; 决定了计算时矩阵的n的大小 可选值为 Uint_N_Array, Int_N_Array */
    /** @typedef {Number} int      整形数字 */
    /** @typedef {Number} double   双浮点数字 */
    /** @typedef {Number} float    单浮点数字 */
    /** @typedef {Number[]|Float32Array|Float64Array|Matrix} List_Value 数据的各种存储形式 */
// end  * 类型注释 * end

// open * 数与代数 * open 

    // open * 帕斯卡三角 * open
        /** @type {Number[][]} 缓存的帕斯卡三角数据 */
        var G_PASCALS_TRIANGLE=[[1]];
        /*h*/calc_PascalsTriangle(3);
        /** 演算帕斯卡三角
         * @param {Number} n 到多少阶停止
         * @returns 演算并返回缓存的帕斯卡三角数据 不规则二维数组, **别修改内容返回值的内容**!
         */
        function calc_PascalsTriangle(n){
            var i,j;
            var rtn=G_PASCALS_TRIANGLE;
            for(i=rtn.length;i<=n;++i){
                rtn.push([]);
                for(j=0;j<i+1;++j){
                    rtn[i].push((rtn[i-1][j]||0)+(rtn[i-1][j-1]||0));
                }
            }
            return rtn;
        }
        /** 获取帕斯卡三角的某一层
         * @param {Number} n 第n层 从 0 开始数数
         */
        function get_PascalsTriangle(n){
            if(G_PASCALS_TRIANGLE.length<=n)calc_PascalsTriangle(n);
            return G_PASCALS_TRIANGLE[n];
        }
    // end  * 帕斯卡三角 * end 

    /** 多次函数的导数 d(f);
     * ```
     *         coefficients.length
     *  F(t) = ∑ t^i*c[i]
     *         i=0
     * ```
     * @param {Number[]} coefficients 各次幂的系数 [1, t^1, t^2, t^3, ...]
     * @returns {Number[]}  导数的各次幂的系数 [1, t^1, t^2, t^3, ...] 长度会比形参少 1
     */
    function derivative(coefficients){
        var i=coefficients.length-1,
            rtn=new Array(i);
        for(;i>0;--i){
            rtn[i-1]=coefficients[i]*i;
        }
        return rtn;
    }

    // open * 解方程 * open
        /** 解二元一次方程
         * z1 + o1 \* x = z2 + o2 \* y;
         * z3 + o3 \* x = z4 + o4 \* y;
         * @returns {{x:Number,y:Number}} 
         */
        function solve_BinaryLinearEquation(z1,o1,z2,o2,z3,o3,z4,o4){
            var x=(z2*o4+o2*z3-z4*o2-z1*o4)/(o1*o4-o2*o3),
                y=(z3+o3*x-z4)/o4;
            return {x:x,y:y};
        }

        /** 解一元三次方程, ax^3+bx^2+cx+d=0
         * @param {Number[]} coefficient 系数集合 从低次幂到高次幂 [ x^0, x^1, x^2, x^3 ]
         * @returns {Number[]} 返回根的集合
         */
        function calc_rootsOfCubic(coefficient){
            var a=coefficient[2]||0,
                b=coefficient[1]||0,
                c=coefficient[0]||0,
                d=coefficient[3]||0;

            //一元一至三次函数求根公式编程表示 来自 https://pomax.github.io/bezierinfo/zh-CN/index.html#extremities
            
            // Quartic curves: Cardano's algorithm.

            // do a check to see whether we even need cubic solving:
            if (approximately(d, 0)) {
                // this is not a cubic curve.
                if (approximately(a, 0)) {
                    // in fact, this is not a quadratic curve either.
                    if (approximately(b, 0)) {
                        // in fact in fact, there are no solutions.
                        return [];
                    }
                    // linear solution
                    return [-c / b];
                }
                // quadratic solution
                var k=b * b - 4 * a * c;
                if(k<0)return [];
                var q = Math.sqrt(k), a2 = 2 * a;
                return [(q - b) / a2, (-b - q) / a2];
            }
            
            a /= d;
            b /= d;
            c /= d;

            var p = (3 * b - a * a) / 3,
                p3 = p / 3,
                q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
                q2 = q / 2,
                discriminant = q2 * q2 + p3 * p3 * p3;

            // and some variables we're going to use later on:
            var u1, v1, root1, root2, root3;

            // three possible real roots:
            if (discriminant < 0) {
                var mp3 = -p / 3,
                    mp33 = mp3 * mp3 * mp3,
                    r = Math.sqrt(mp33),
                    t = -q / (2 * r),
                    cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
                    phi = Math.acos(cosphi),
                    crtr = calc_rootsOfCubic.cuberoot(r),
                    t1 = 2 * crtr;
                root1 = t1 * Math.cos(phi / 3) - a / 3;
                root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
                root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
                return [root1, root2, root3];
            }

            // three real roots, but two of them are equal:
            if (discriminant === 0) {
                u1 = q2 < 0 ? calc_rootsOfCubic.cuberoot(-q2) : -calc_rootsOfCubic.cuberoot(q2);
                root1 = 2 * u1 - a / 3;
                root2 = -u1 - a / 3;
                return [root1, root2];
            }

            // one real root, two complex roots
            var sd = Math.sqrt(discriminant);
            u1 = calc_rootsOfCubic.cuberoot(sd - q2);
            v1 = calc_rootsOfCubic.cuberoot(sd + q2);
            root1 = u1 - v1 - a / 3;
            return [root1];
        }
        calc_rootsOfCubic.cuberoot=function(v){
            return v < 0?-Math.pow(-v, 1 / 3) : Math.pow(v, 1 / 3);
        }
    // end  * 解方程 * end 

// end  * 数与代数 * end 

// open * 线性代数 * open

    /** 向量 */
    class Vector extends CONFIG.VALUE_TYPE{
        // 继承使用 CONFIG.VALUE_TYPE 的构造函数

        /** 判断2d向量在哪个象限上, 规定 0 视作正
         * @param  {List_Value} v 向量
         * @return {int} 返回在哪个象限
         */
        static v2__get_Quadrant(v){
            var f1=v[0]>=0,f2=v[1]>=0;
            if(f1){
                if(f2)  return 1;
                else    return 4;
            }else{
                if(f2)  return 2; 
                else    return 3; 
            }
        }
        
        /** 求模长
         * @param  {List_Value} v 向量
         * @return {Number} 返回模长
         */
        static mag(v) {
            var temp=0;
            for(var i =v.length-1;i>=0;--i){
                temp+=v[i]*v[i];
            }
            return sqrt(temp);
        }

        /** 判断某个向量是否为单位向量
         * @param {List_Value} v 向量
         * @param {boolean} 返回是否为单位向量
         */
        static is_Unit(v){
            return abs(1-Vector.dot(v,v))<CONFIG.APPROXIMATELY_TOLERANCE;
        }

        /** 创建标准化向量
         * @param  {List_Value} v 向量
         * @return {Vector} 返回新的向量
         */
        static create_Normalization(v){
            return Vector.normalize(Vector.copy(v));
        }

        /** 标准化向量
         * @param  {List_Value} v 向量
         * @return {List_Value} 修改并返回 v
         */
        static normalize(v) {
            if(!Vector.is_Zero(v))throw new Error("This is a zero Vector.");
            var magSq = v.get_Mag(),oneOverMag=0;
            if (magSq>0) {
                oneOverMag = 1.0/magSq;
                for(var i =v.length-1;i>=0;--i){
                    v[i] *= oneOverMag;
                }
            }
            return v;
        }

        /** 判断向量是不是零向量
         * @param  {List_Value} v 向量
         * @return {Number} 返回0或非0
         */
        static is_Zero(v){
            var i=v.length;
            do{
                --i;
            }while((!v[i])&&i>0)
            return v[i];
        }
        
        /** 判断向量是否相等
         * @param  {List_Value} v1 向量1
         * @param  {List_Value} v2 向量2
         * @return {Boolean}
         */
        static is_Equal(v1,v2){
            var i=v1.length;
            if(i!==v2.length)return false;
            do{
                --i;
            }while((v1[i]===v2[i])&&i>0)
            return v1[i]===v2[i];
        }
        
        /** 取反
         * @param  {List_Value} v 向量
         * @return {Vector} 返回新的向量
         */
        static instead(v){
            return Vector.instead_b(new Vector(v));
        }
        
        /** 取反
         * @param  {List_Value} v 向量
         * @return {List_Value} 修改并返回v
         */
        static instead_b(v){
            for(var i=v.length-1;i>=0;--i){
                v[i]*=-1;
            }
            return v;
        }

        /** 求向量和
         * @param  {List_Value} v1 向量1
         * @param  {List_Value} v2 向量2
         * @return {Vector} 返回新的向量
         */
        static sum(v1,v2){
            return Vector.translate(new Vector(v1),v2);
        }
        
        /** 再平移
         * @param {List_Value} v1  原向量
         * @param {List_Value} v2  偏移量向量
         * @return {List_Value} 修改并返回 v1
         */
        static translate(v1,v2){
            if(v1.length!==v2.length) throw new Error("They vectors have different length!")
            for(var i=v1.length-1;i>=0;--i){
                v1[i]+=v2[i];
            }
            return v1;
        }
        
        /** 求向量差 1-2
         * @param {List_Value} v1 向量1
         * @param {List_Value} v2 向量2
         * @return {Vector} 返回一个新向量
         */
        static dif(v1,v2){
            // return Vector.translate(Vector.instead(v2),v1);
            
            if(v1.length!==v2.length) throw new Error("They vectors have different length!")
            var rtn=new Vector(v1);
            for(var i=rtn.length-1;i>=0;--i){
                rtn[i]-=v2[i];
            }
            return rtn;
        }
        
        /** 数字乘向量 
         * @param {List_Value} v    向量
         * @param {Number} n 标量
         * @return {Vector} 返回新的向量
         */
        static np(v,n){
            return Vector.np_b(new Vector(v),n);
        }

        /** 数字乘向量 
         * @param {List_Value} v    向量
         * @param {Number} n 标量
         * @return {Vector} 修改并返回 v
         */
        static np_b(v,n){
            for(var i=v.length-1;i>=0;--i){
                v[i]*=n;
            }
            return v;
        }

        /** 向量内积
         * @param {List_Value} v1 向量1
         * @param {List_Value} v2 向量2
         * @return {Number} 返回 v1 * v2
         */
        static dot(v1,v2){
            if(v1.length!==v2.length) throw new Error("They vectors have different length!")
            var rtn=0;
            for(var i=v1.length-1;i>=0;--i){
                rtn+=v1[i]*v2[i];
            }
            return rtn;
        }

        /** 向量外积 仅支持 3D 和 2D 向量
         * @param {List_Value} v1 向量1
         * @param {List_Value} v2 向量2
         * @return {Number|List_Value} 返回 v1 x v2
         */
        static cross(v1,v2){
            if(v1.length===2&&v2.length===2)return v1[0]*v2[1]-v1[1]*v2[0];
            else if(v1.length===3&&v2.length===3) return  new Vector([
                v1[1]*v2[2]-v1[2]*v2[1],    // x : y1z2-z1y2
                v1[2]*v2[0]-v1[0]*v2[2],    // y : z1x2-x1z2
                v1[0]*v2[1]-v1[1]*v2[0]     // z : x1y2-y1x2
            ]);
            else throw new Error("This function only run in 2D or 3D Vector! ");
        }

        /** 计算向量夹角 ∠AOB 的 cos
         * @param {List_Value} v1 表示角的一边的射线上 的 向量A
         * @param {List_Value} v2 表示角的一边的射线上 的 向量B
         * @return {Number} 返回夹角的cos值
         */
        static cos_VV(v1,v2){
            return Vector.dot(v1,v2)/(Vector.mag(v1)*Vector.mag(v2));
        }
    }

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
         * @param {List_Value} m 矩阵
         * @param {int} w 矩阵有多少列(宽度)
         * @return {Number[][]} 
         */
        static create_Print(m,w){
            var l=m.length,i,
                n=parseInt(w||parseInt(sqrt(l)));
            var rtn=[];
            i=0;
            do{
                rtn.push(m.slice(i,i+=n));
            }while(i<l);
            return rtn;
        }

        /** 校验矩阵是否为方阵
         * @param {List_Value} m    矩阵
         * @param {int} [_n]    n阶矩阵
         * @return {int} 返回 n
         * @throws {Error} 当 n 和 m 的长度 无法形成方阵时 将会抛出异常
         */
        static check_Square(m,_n){
            var n=parseInt(_n||sqrt(m.length));
            if(n*n!==m.length) throw new Error("This is not a square matrix! It should be a (n*n)!");
            return n;
        }

        /** 根据原矩阵创建新的矩阵, 可以改变矩阵的宽高, 在空的地方会写入单位矩阵的数据 
         * ```
         * create_NewSize([1,2,3,4],2,3);    create_NewSize([1,2,3,4],2,3,2,3,2,1);
         * // [1,2]    [1,2,0]               // [1,2]    [1,0,0]
         * // [3,4] >> [3,4,0]               // [3,4] >> [0,1,0] 
         * //          [0,0,1]               //          [0,1,1]
         * ```
         * @param {Matrix} m    原矩阵
         * @param {int} low_w           原矩阵宽度
         * @param {int} new_w           新矩阵宽度
         * @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w
         * @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w
         * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0
         * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left
         * @return {Matrix} 返回一个新矩阵
         */
        static create_NewSize(m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top){
            var rtn=Matrix.create_Identity(new_w,_new_h);
            return Matrix.setup(rtn,m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top);
        }


        /** 矩阵数据转移
         * @param {Matrix} rtn  要写入的矩阵
         * @param {Matrix} m    数据来源矩阵
         * @param {int} low_w           原矩阵宽度
         * @param {int} new_w           新矩阵宽度
         * @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w
         * @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w
         * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0
         * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left
         * @return {Matrix} 修改 rtn 并返回
         */
        static setup(rtn,m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top){
            var low_h=_low_h||low_w,new_h=_new_h||new_w,
                shift_top  = (_shift_top&&((new_w+_shift_top)%new_w))||0,
                shift_left = _shift_left===undefined?shift_top:((new_h+_shift_left)%new_h),
                l=new_w*new_h,
                temp_u,temp_v,
                i,u,v;
            u=new_w-1;
            v=new_h-1;
            temp_u=u-shift_left;
            temp_v=v-shift_top;
            for(i=l-1;i>=0;--i){
                if(!(temp_u>=low_w||temp_v>=low_h)){
                    rtn[i]=m[temp_v*low_w+temp_u];
                }
                --u;
                --temp_u;
                if(temp_u<0)temp_u=new_w-1;
                if(u<0){
                    u=new_w-1;
                    --v;
                    --temp_v;
                    if(temp_v<0)temp_v=new_h-1;
                }
            }
            return rtn;
        }

        /** 计算张量积
         * @param {List_Value} m1 矩阵1
         * @param {List_Value} m2 矩阵2
         * @param {int} [_w1] 矩阵1的宽度 默认认为 m1 是列向量(w1=1)
         * @param {int} [_h1] 矩阵1的高度 默认认为 m1 是列向量(h1=m1.length)
         * @param {int} [_w2] 矩阵2的宽度 默认认为 m2 是行向量(w2=m2.length)
         * @param {int} [_h2] 矩阵2的高度 默认认为 m2 是行向量(h2=1)
         * @return {Matrix} 返回一个新的矩阵
         */
        static create_TensorProduct(m1,m2,_w1,_h1,_w2,_h2){
            var w1=_w1||1,
                h1=_h1||m1.length,
                w2=_w2||m2.length,
                h2=_h2||1,
                i=w1*h1;
            var rtn=new Array(i);
            for(--i;i>=0;--i){
                rtn[i]=Matrix.np(m2,m1[i]||0);
            }
            return Matrix.concat(rtn,w1,w2,h1,h2);
        }

        /** 合并矩阵
         * @param  {List_Value[]} m_list 传入多个矩阵,矩阵应该拥有相同大小
         * @param  {int} w_l      m_list中一行放几个矩阵
         * @param  {int} w_m      m_list[i]的宽度
         * @param  {int} [_h_l]   m_list中一列放几个矩阵
         * @param  {int} [_h_m]   m_list[i]的高度
         * @return {Matrix} 返回一个新的矩阵
         * ```javascript
         *    Matrix.create_Concat([[1,2,3,4], [5,6,7,8]], 2, 2);
         *    // [1,2]   [5,6] >> [1,2,5,6] >> [1,2,5,6,3,4,7,8]
         *    // [3,4] , [7,8]    [3,4,7,8]
         * ```
         */
        static concat(m_list,w_l,w_m,_h_l,_h_m){
            var h_l=_h_l||Math.ceil(m_list.length/w_l),
                h_m=_h_m||Math.ceil(m_list[0].length/w_m),
                l_l=w_l*h_l,
                l_m=w_m*h_m,
                l=l_l*l_m,
                w=w_l*w_m,
                u_l,v_l,u,v,i,j,k;
            var rtn=new Matrix(l);
            k=l_l;
            for(v_l=h_l-1;v_l>=0;--v_l){
                for(u_l=w_l-1;u_l>=0;--u_l){
                    --k;
                    j=l_m;
                    for(v=h_m-1;v>=0;--v){
                        i=(v_l*h_m+v)*w+w_m*(u_l+1);
                        if(m_list[k])
                        for(u=w_m-1;u>=0;--u){
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
         * @param {List_Value}     m   矩阵
         * @param {Number}  k   标量
         * @return {Matrix} 返回一个新的矩阵
         */
        static np(m,k){
            return Matrix.np_b(new Matrix(m),k);
        }

        /** 矩阵乘标量
         * @param {List_Value}     m   矩阵
         * @param {Number}  k   标量
         * @return {List_Value} 修改m并返回
         */
        static np_b(m,k){
            var i;
            for(i=m.length-1;i>=0;--i){
                m[i]*=k;
            }
            return m;
        }

        /** 使用 uv 获取 index 
         * @param {int} n 矩阵宽度 (列数)
         * @param {int} u 元素的 u 坐标 (第u列)
         * @param {int} v 元素的 v 坐标 (第v行)
         */
        static get_Index(n,u,v){
            return v*n+u;
        }

        /** 创建单位矩阵
         * @param {int}  w   矩阵宽度
         * @param {int} [h]  矩阵高度 默认和 w 相等
         * @return {Matrix} 
         */
        static create_Identity(w,_h){
            var h=_h||w;
            var l=w*h, sp=w+1, i=0,j=w>h?h:w;
            var rtn=new Matrix(l);
            do{
                rtn[i]=1.0;
                i+=sp;
                --j
            }while(j>0);
            return rtn;
        }
        
        /** 初等变换 换行操作
         * @param {List_Value|List_Value[]} m 一个或多个矩阵
         * @param {int} n       n阶矩阵 用来表示一行的长度
         * @param {int} v1      矩阵v坐标1 (要对调的行下标1)
         * @param {int} v2      矩阵v坐标2 (要对调的行下标2)
         * @return {m} 修改并返回m
         */
        static transform_Exchange(m,n,v1,v2){
            var i,j,k,l,t;
            var f=ArrayBuffer.isView(m[0])||Array.isArray(m[0]);
            // 换行
            for(i=v1*n,j=v2*n,k=n; k>0; --k,++i,++j){
                if(f){
                    for(l=m.length-1;l>=0;--l){
                        t=m[l][i];
                        m[l][i]=m[l][j];
                        m[l][j]=t;  
                    }
                }else{
                    t=m[i];
                    m[i]=m[j];
                    m[j]=t;
                }
            }
            return m;
        }

        /** 初等变换 某行乘标量
         * @param {List_Value|List_Value[]} m     矩阵
         * @param {int} n           n阶矩阵
         * @param {int} v           矩阵的v坐标(行下标)
         * @param {Number} value    乘法中的标量部分
         */
        static transform_multiplication(m,n,v,value){
            var i,j,l;
            var f=ArrayBuffer.isView(m[0])||Array.isArray(m[0]);
            // 换行
            if(f){
                for(i=v*n,k=n; k>0; --k,++i){
                    for(l=m.length-1;l>=0;--l) m[l][j]*=value;  
                }
            }else{
                for(i=v*n,k=n; k>0; --k,++i) m[j]*=value;
            }
            return m;
        }
        
        /** 将矩阵某个为0的项 通过初等变换的换行操作, 变成非0
         * @param {List_Value|List_Value[]} m     一个或多个矩阵
         * @param {int} index       当前下标
         * @param {int} v           当前v坐标(行下标)
         * @param {int} spl         寻址步长,应为 ±n
         * @param {int} [_index_m]   传入多个矩阵时使用哪个矩阵的值 默认0
         * @return {m} 
         */
        static exchange_zero(m,index,v,spl,_index_m){
            if(!spl) return m;
            var _v=v,i;
            var f=spl>0?1:-1;
            var tm=(ArrayBuffer.isView(m[0])||Array.isArray(m[0]))?m[_index_m||0]:m;
            for(i=index;tm[i]!==undefined;i+=spl,_v+=f){
                if(tm[i]){
                    if(_v===v)  return m;
                    else        return Matrix.transform_Exchange(m,Math.abs(spl),_v,v);
                }
            }
            // 找不到可以替换的
            return m;
        }

        /** 矩阵乘法    如果不传入矩阵宽高信息将视为方阵
         * @param {List_Value} m1 矩阵1
         * @param {List_Value} m2 矩阵2
         * @param {int} [_h1]   左矩阵的行数(高度)
         * @param {int} [_w1h2] 左矩阵的列数(宽度) 与 右矩阵的行数(高度)
         * @param {int} [_w2]   右矩阵的列数(宽度)
         * @return {Matrix} 返回一个新的矩阵
         */
        static multiplication(m1,m2,_h1,_w1h2,_w2){
            var n=_h1||_w1h2||_w2;
            if(!n){
                n=Matrix.check_Square(m1);
                Matrix.check_Square(m2,n);
            }
            var h1=_h1||n,
                w1h2=_w1h2||n,
                w2=_w2||n;
            if(h1<=0&&w1h2<=0&&w2<=0) throw new Error ("This is a null matrix!");
            var l=w2*h1, _u, _v, u, v, index, i;
            var rtn=new Matrix(l);
            
            for(v=h1-1;v>=0;--v){
                for(u=w2-1;u>=0;--u){
                    _u=v*w1h2;
                    _v=u;
                    index=v*w2+u;
                    for(i=w1h2;i>0;--i,++_u,_v+=w2){
                        rtn[index]+=m1[_u]*m2[_v]
                    }
                }
            }
            return rtn;
        }

        /** 检查矩阵正交
         * @param {Matrix} m    矩阵
         * @param {Matrix} [_n] n阶矩阵
         * @return {Boolean}
         */
        static check_Orthogonal(m,_n){

            var n=Matrix.check_Square(m,_n);
            var r=new Array(n);
            var i,j;
            for(i=n-1;i>=0;--i){
                r[i]=new Vector(n);
                for(j=n-1;j>=0;--j){
                    r[i][j]=m[3*i+j];
                }
            }
            var f=true;
            for(i=n-1;f&&(i>=0);--i){
                for(j=n-1;f&&(j>=0);--j){
                    f=approximately(Vector.dot(r[i],r[j]),i===j?1:0);
                }
            }
            return f;
            
        }

        /** 矩阵转置
         * @param {List_Value} m 矩阵
         * @param {int} [_w] 矩阵宽度(列数)
         * @param {int} [_h] 矩阵高度(行数)
         * @return {m} 修改m并返回
         */
        static transpose(m,_w,_h){
            var u, v, tu, tv, temp;
            var n=_w||Matrix.check_Square(m,_n);
            if(n===(_h||n)){  //方阵
                for(v=n-1; v>0; --v){
                    for(u=v-1; u>=0; --u){
                        tu=v*n+u;
                        tv=u*n+v;
                        temp=m[tv];
                        m[tv]=m[tu];
                        m[tu]=temp;
                    }
                }
            }else{
                tu=m.length
                temp=new Array(m.length);
                for(--tu,v=_w-1,u=_h-1;tu>=0;--tu,--u){
                    if(u===-1){
                        u=_h-1;
                        --v;
                    }
                    temp[tu]=m[u*_w+v]
                }
                u=m.length-1;
                do{
                    m[u]=temp[u];
                    --u;
                }while(u>=0)
            }
            return m;
        }

        /** 创建矩阵的转置
         * @param {List_Value} m 矩阵
         * @param {int} [_n] 矩阵为n阶矩阵
         * @return {m} 返回一个新的矩阵
         */
        static create_Transposed(m,_n){
            return Matrix.transpose(new Matrix(m),_n);
        }
        
        /** 计算矩阵行列式
         * @param {List_Value} m 矩阵
         * @param {int} [_n] 矩阵为n阶矩阵
         * @return {Number} 返回矩阵的行列式
         */
        static calc_Det(m,_n){
            switch(m.length){

                case 1: return  m[0];
                break;

                case 4: return  m[0]*m[3]-m[1]*m[2];
                break;

                case 9: return  m[0] * (m[4]*m[8] - m[5]*m[7])+
                                m[1] * (m[5]*m[6] - m[3]*m[8])+
                                m[2] * (m[3]*m[7] - m[5]*m[6]);
                break;

                case 16:
                    var t0  = m[0]  * m[5]  - m[1]  * m[4],
                        t1  = m[0]  * m[6]  - m[2]  * m[4],
                        t2  = m[0]  * m[7]  - m[3]  * m[4],
                        t3  = m[1]  * m[6]  - m[2]  * m[5],
                        t4  = m[1]  * m[7]  - m[3]  * m[5],
                        t5  = m[2]  * m[7]  - m[3]  * m[6],
                        t6  = m[8]  * m[13] - m[9]  * m[12],
                        t7  = m[8]  * m[14] - m[10] * m[12],
                        t8  = m[8]  * m[15] - m[11] * m[12],
                        t9  = m[9]  * m[14] - m[10] * m[13],
                        t10 = m[9]  * m[15] - m[11] * m[13],
                        t11 = m[10] * m[15] - m[11] * m[14];
                    
                    return t0 * t11 - t1 * t10 + t2 * t9 + t3 * t8 - t4 * t7 + t5 * t6;
                break;

                default:
                    return Matrix.calc_Det__Transform(m,_n);
                break;
            }
        }

        /** 计算矩阵行列式 --使用初等变换
         * @param {List_Value} m 矩阵
         * @param {int} [_n] 矩阵为n阶矩阵
         * @return {Number} 返回矩阵的行列式
         */
        static calc_Det__Transform(m,_n){
            var n, uv, uv_i, i, j, flag=1;
            var k, sp;
            var m__transform, temp_row;
            n=Matrix.check_Square(m,_n);
            m__transform=new Matrix(m)
            for(uv=n-1; uv>0; --uv){
                uv_i=uv*n+uv;
                if(!m__transform[uv_i]){
                    // 换行
                    Matrix.exchange_zero(m__transform,uv_i,uv,-n);
                    if(!m__transform[uv_i])return 0;
                    else flag*=-1;
                }
                temp_row=m__transform.slice(uv_i-uv,uv_i);
                // 单位化
                if(!(m__transform[uv_i]===1)){
                    sp=1/(m__transform[uv_i]);
                    i = uv;
                    for(--i; i>=0; --i){
                        temp_row[i]*=sp;
                    }
                }
                // 消元
                for(uv_i-=n;uv_i>=0;uv_i-=n){
                    k=m__transform[uv_i];
                    if(k===0)continue;
                    for(i=uv,j=uv_i; i>=0; --i,--j){
                        m__transform[j]-=k*[temp_row[i]];
                    }
                }
            }
            for(sp=1,j=m__transform.length-1; j>=0; j-=n+1){
                sp*=m__transform[j];
            }
            return sp*flag;
        }

        /** 变换得到矩阵逆
         * @param {List_Value} m 传入矩阵, 计算完后将会变成单位矩阵
         * @param {int} [_n]     矩阵为n阶矩阵
         * @return {Matrix}      返回一个新的矩阵
         */
        static inverse__Transform(m,_n){
            var n,uv,uv_i,i,j,v,temp;
            var k,sp;
            var _m=[];

            n=Matrix.check_Square(m,_n);
            _m[0]=m;
            _m[1]=Matrix.create_Identity(n);
            
            for(uv=n-1; uv>=0; --uv){
                uv_i=uv*n+uv;
                if(!_m[0][uv_i]){
                    // 换行
                    Matrix.exchange_zero(_m,uv_i,uv,-n);
                    if(!_m[0][uv_i]){
                        console.warn("This is a singular matrix!");
                        return m;
                    }
                }
                k=uv_i-uv;
                // 单位化
                if(!(_m[0][uv_i]===1)){
                    sp=1/(_m[0][uv_i]);
                    for(i = n-1; i>=0; --i){
                        _m[0][k+i]*=sp;
                        _m[1][k+i]*=sp;
                    }
                }
                // 消元
                for(v=n-1,uv_i=v*n+uv;uv_i>=0;--v,uv_i=v*n+uv){
                    k=_m[0][uv_i];
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
         * @param {List_Value} m       矩阵
         * @param {int} [_n]    矩阵为n阶矩阵
         * @return {Matrix|null}     返回一个新的矩阵
         */
        static create_Inverse(m,_n){
            // 公式法 m^-1=adj(m)/|m|
            switch (m.length) {
                case 1:
                    return new Matrix([1/m[0]]);
                break;
                
                case 4:
                    var d = Matrix.calc_Det(m);
                    if(approximately(d,0))return null;
                    d=1/d;
                    return new Matrix([
                            m[3]*d, -m[1]*d,
                        -m[2]*d,  m[0]*d,
                    ]);
                break;
                
                case 9:
                    var d = Matrix.calc_Det(m);
                    if(approximately(d,0))return null;
                    d=1/d;
                    return new Matrix([
                        (m[4]*m[8]-m[7]*m[5])*d,    (m[3]*m[8]-m[6]*m[5])*d,    (m[3]*m[7]-m[6]*m[4])*d,
                        (m[1]*m[8]-m[7]*m[2])*d,    (m[0]*m[8]-m[6]*m[2])*d,    (m[0]*m[7]-m[6]*m[1])*d,
                        (m[1]*m[5]-m[4]*m[2])*d,    (m[0]*m[5]-m[3]*m[2])*d,    (m[0]*m[4]-m[3]*m[1])*d,
                    ]);
                break;
                
                case 16:
                    var t00 = m[0]  * m[5]  - m[1]  * m[4],
                        t01 = m[0]  * m[6]  - m[2]  * m[4],
                        t02 = m[0]  * m[7]  - m[3]  * m[4],
                        t03 = m[1]  * m[6]  - m[2]  * m[5],
                        t04 = m[1]  * m[7]  - m[3]  * m[5],
                        t05 = m[2]  * m[7]  - m[3]  * m[6],
                        t06 = m[8]  * m[13] - m[9]  * m[12],
                        t07 = m[8]  * m[14] - m[10] * m[12],
                        t08 = m[8]  * m[15] - m[11] * m[12],
                        t09 = m[9]  * m[14] - m[10] * m[13],
                        t10 = m[9]  * m[15] - m[11] * m[13],
                        t11 = m[10] * m[15] - m[11] * m[14];
                    
                    var d=t00*t11-t01*t10+t02*t09+t03*t08-t04*t07+t05*t06;
                    if(approximately(d,0))return null;
                    d=1/d;

                    return new Matrix([
                        (m[5]*t11-m[6]*t10+m[7]*t09)*d,    (m[2]*t10-m[1]*t11-m[3]*t09)*d,    (m[13]*t05-m[14]*t04+m[15]*t03)*d,    (m[10]*t04-m[9] *t05-m[11]*t03)*d,
                        (m[6]*t08-m[4]*t11-m[7]*t07)*d,    (m[0]*t11-m[2]*t08+m[3]*t07)*d,    (m[14]*t02-m[12]*t05-m[15]*t01)*d,    (m[8] *t05-m[10]*t02+m[11]*t01)*d,
                        (m[4]*t10-m[5]*t08+m[7]*t06)*d,    (m[1]*t08-m[0]*t10-m[3]*t06)*d,    (m[12]*t04-m[13]*t02+m[15]*t00)*d,    (m[9] *t02-m[8] *t04-m[11]*t00)*d,
                        (m[5]*t07-m[4]*t09-m[6]*t06)*d,    (m[0]*t09-m[1]*t07+m[2]*t06)*d,    (m[13]*t01-m[12]*t03-m[14]*t00)*d,    (m[8] *t03-m[9] *t01+m[10]*t00)*d
                    ]);
                break;
                
                default:
                    // 高斯乔丹消元法(初等变换法)
                    return Matrix.inverse__Transform(new Matrix(m),_n);
                break;
            }
            
        }
    }

// end  * 线性代数 * end 

// open * 基础图形学 * open

    // open * 2d 变换矩阵 * open

        /** 用于创建2d变换矩阵的静态类 */
        class Matrix_2 extends Matrix{
            /** 创建旋转矩阵
             * @param {Number} theta 顺时针 旋转角弧度
             * @return {Matrix_2}
             */
            static create_Rotate(theta){
                var s=Math.sin(theta),
                    c=Math.cos(theta);
                return new Matrix_2([c,s,-s,c]);
            }

            /** 创建旋转矩阵 使用向量
             * @param {Vector} _v 2d向量
             * @return {Matrix_2}
             */
            static create_Rotate__v(_v){
                var v=Vector.is_Unit(_v)?_v:Vector.create_Normalization(_v);
                return new Matrix_2([v[0],v[1],-v[1],v[0]]);
            }

            /** 创建缩放矩阵
             * @param {Number} x x 轴方向上的缩放系数
             * @param {Number} y y 轴方向上的缩放系数
             * @return {Matrix_2}
             */
            static create_Scale(x,y){
                return new Matrix_2([x,0,0,y]);
            }

            /** 创建镜像矩阵(对称)
             * @param {Number} x 对称轴的法向 x 坐标
             * @param {Number} y 对称轴的法向 y 坐标
             * @return {Matrix_2}
             */
            static create_Horizontal (x,y){
                var i2xy=-2*x*y;
                return new Matrix_2(
                    1-2*x*x ,   i2xy,
                    i2xy    ,   1-2*y*y
                )
            }

            /** 创建切变矩阵
             * @param {Number} kx x方向的切变系数
             * @param {Number} ky y方向的切变系数
             * @return {Matrix_2}
             */
            static create_Shear(kx,ky){
                    return new Matrix_2([1,ky,kx,1]);
            }

            /** 创建单位矩阵
             * @return {Matrix_2}
             */
            static create_Identity(){
                return new Matrix_2([1,0,0,1]);
            }

            /** 创建等比缩放&旋转矩阵 根据向量生成矩阵
             * @param {List_Value} v2 2d向量
             * @return {Matrix_2} 返回一个矩阵
             */
            static create_ByVector(v2){
                return new Matrix_2([v2[0],v2[1],-1*v2[1],v2[0]]);
            }
        }

        Matrix_2.ROTATE_90=new Matrix_2([0,1,-1,0]);
        Matrix_2.ROTATE_90_I=new Matrix_2([0,-1,1,0]);
        Matrix_2.FLIP_HORIZONTAL=new Matrix_2([-1,0,0,1]);
        
    // end  * 2d 变换矩阵 * end 

    // open * 3d 变换矩阵 * open
        /** 用于创建3D变换矩阵的静态类
         *  规定统一使用左手坐标系
         * ```
         *           ^  +y
         *           |     7 +z
         *           |  /  
         *  ---------+---------> +x
         *        /  |   
         *     /     |   
         *           |   
         * ```
         */
        class Matrix_3 extends Matrix{
            /** 创建缩放矩阵
             * @param {flot} x x坐标中的缩放系数
             * @param {flot} y y坐标中的缩放系数
             * @param {flot} z z坐标中的缩放系数
             * @returns {Matrix_3} 返回一个矩阵
             */
            static create_Scale(x,y,z){
                return new Matrix_3([
                    x,0,0,
                    0,y,0,
                    0,0,z
                ]);
            }
            /** 创建旋转矩阵
             * @param {Number} theta 旋转弧度
             * @param {int} axis 旋转中心轴  [z,x,y] 默认为 0 (z)
             * @return {Matrix_3} 返回一个矩阵
             */
            static create_Rotate(theta,axis){
                var s=sin(theta),
                    c=cos(theta);
                return Matrix.create_NewSize([ c, s,-s, c,],2,3,2,3,axis,axis);
            }

            /** 创建旋转矩阵 使用任意旋转轴
             * @param {Float} theta 旋转弧度
             * @param {List_Value} axis 一个3D向量表示的旋转轴
             * @return {Matrix_3} 返回一个矩阵
             */
            static create_Rotate__Axis(theta,axis){
                var k     = Vector.is_Unit(axis)?axis:Vector.create_Normalization(axis),
                    sin_t = sin(theta),
                    cos_t = cos(theta),
                    rtn   = Matrix.create_TensorProduct(axis,axis,1,3,3,1),
                    skx   = sin_t*k[0],
                    sky   = sin_t*k[1],
                    skz   = sin_t*k[2];

                Matrix.np_b(rtn,1-cos_t);

                rtn[0] += cos_t;      rtn[1] -= skz;        rtn[2] += sky;
                rtn[3] += skz;        rtn[4] += cos_t;      rtn[5] -= skx;
                rtn[6] -= sky;        rtn[7] += skx;        rtn[8] += cos_t;

                return rtn;
            }

            /** 创建旋转矩阵, 使用欧拉角
             * @param {List_Value} euler_angles 欧拉角参数 各旋转角角的弧度
             * @param {List_Value} _axis 欧拉角的旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)
             * @return {Matrix_3} 返回一个矩阵
             */
            static create_Rotate__EulerAngles(euler_angles,_axis){
                var axis=_axis||[0,1,2]
                var rtn = Matrix_3.create_Rotate(euler_angles[0],axis[0]);
                for(var i=1;i<3;++i){
                    rtn=Matrix.multiplication(rtn,Matrix_3.create_Rotate(euler_angles[i],axis[i]),3,3);
                }
                return rtn;
            }

            /** 创建旋转矩阵, 使用四元数
             * @param {List_Value} quat 欧拉角参数 各旋转角角的弧度
             * @return {Matrix_3} 返回一个矩阵
             */
            static create_Rotate__QUAT(quat){
                // todo
            }

            /** 创建正交投影(平行投影)矩阵
             * @param {List_Value} normal 使用3d向量表示 投影面的法向
             * @return {Matrix_3} 返回一个矩阵
             */
            static create_Projection__Orthographic(normal){
                var n= Vector.is_Unit(normal)?normal:Vector.create_Normalization(normal);
                var xx=n[0]*n[0],
                    xy=n[0]*n[1],
                    xz=n[0]*n[2],
                    yy=n[1]*n[1],
                    yz=n[1]*n[2],
                    zz=n[2]*n[2];
                return new Matrix_3([
                    1-xx,   -xy,    -xz,
                    -xy,    1-yy,   -yz,
                    -xz,    -yz,    1-zz
                ])
            }
            
            /** 创建切变矩阵
             * @param {Number[]} k  切变系数, 使用二维向量表示
             * @param {Number} axis 在哪个面上进行切变 [xy,xz,yz]
             * @return {Matrix_3}
             */
            static create_Shear(k,axis){
                var rtn=new Matrix_3([1,0,0,0,1,0,0,0,1]);
                var i=Matrix_3._MAPPING_SHEAR_AXIS_TO_INDEX[axis]
                rtn[i]=k[0];
                ++i;
                rtn[i]?++i:0;
                rtn[i]=k[1];
                return rtn;
            }
            /*h*/static _MAPPING_SHEAR_AXIS_TO_INDEX=[6,3,1];
            
            /** 创建镜像矩阵
             * @param {List_Value} n 镜面的法向 3D向量
             * @return {Matrix_3}
             */
            static create_Horizontal(n){
                var i2xy=-2*n[0]*n[1],
                    i2xz=-2*n[0]*n[2],
                    i2yz=-2*n[1]*n[2];
                return new Matrix_3([
                    1-2*n[0]*n[0],  i2xy,           i2xz,
                    i2xy,           1-2*n[1]*n[1],  i2yz,
                    i2xz,           i2yz,           1-2*n[2]*n[2]
                ]);
            }
        }

        Matrix_3.ROTATE_X_CCW_90DEG = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
        Matrix_3.ROTATE_X_CW_90DEG  = new Matrix_3([1, 0, 0, 0, 0, 1, 0, -1, 0 ]);
        Matrix_3.ROTATE_X_180DEG    = new Matrix_3([1, 0, 0, 0, -1, 0, 0, -0, -1 ]);
        Matrix_3.ROTATE_Y_CCW_90DEG = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
        Matrix_3.ROTATE_Y_CW_90DEG  = new Matrix_3([0, 0, -1, 0, 1, 0, 1, 0, 0 ]);
        Matrix_3.ROTATE_Y_180DEG    = new Matrix_3([-1, 0, -0, 0, 1, 0, 0, 0, -1 ]);
        Matrix_3.ROTATE_Z_CCW_90DEG = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
        Matrix_3.ROTATE_Z_CW_90DEG  = new Matrix_3([0, 1, 0, -1, 0, 0, 0, 0, 1 ]);
        Matrix_3.ROTATE_Z_180DEG    = new Matrix_3([-1, 0, 0, -0, -1, 0, 0, 0, 1 ]);
    // end  * 3d 变换矩阵 * end 

    // open * 旋转 * open
        /** 3d旋转控制 */
        class Rotate_3D{
            /**
             * @param {List_Value} data 参数数据 根据长度判断使用什么构造过程
             * @param {Boolean} [_calc_flag] 是否在构造时计算(默认否) (9)矩阵/(3)欧拉角/(4)四元数
             * @param {int[]} [_euler_angles_axis] 欧拉角的顺序 (默认[0,1,2](BPH)(zxy))
             */
            constructor(data,_calc_flag,_euler_angles_axis){
                /** @type {EulerAngles} 欧拉角数据 */
                this._euler_angles=new EulerAngles(3);
                /** @type {Int8Array[]} 欧拉角的顺序 (默认[0,1,2](BPH)(zxy)) */
                this._euler_angles_axis=new Int8Array([0,1,2]);
                if(_euler_angles_axis)copy_Array(this._euler_angles_axis,_euler_angles_axis,3);
                /** @type {Quat} 四元数数据 */
                this._quat=new Quat(4);
                /** @type {Matrix_3} 矩阵数据 */
                this._matrix=new Matrix.create_Identity(3,3);
                switch(data.length){
                    case 3:
                        copy_Array(this._euler_angles,data,3);
                        if(_calc_flag)this.reset__EulerAngles();
                    break;
                        
                    case 4:
                        copy_Array(this._quat,data,4);
                        if(_calc_flag)this.reset__QUAT();
                    break;
                            
                    case 9:
                        copy_Array(this._matrix,data,9);
                        if(_calc_flag)this.reset__Matrix();
                    break;

                    default:
                        console.warn("Have not data, please set it");
                }
            }

            /** 写入 欧拉角 数据
             * @param {EulerAngles} data 欧拉角数据
             * @param {int[]} [_euler_angles_axis] 欧拉角的顺序 (默认[0,1,2](BPH)(zxy))
             * @return {Rotate_3D} 返回this
             */
            set__EulerAngles(data,_euler_angles_axis){
                copy_Array(this._euler_angles,data,3);
                if(_euler_angles_axis)copy_Array(this._euler_angles_axis,_euler_angles_axis,3);
            }

            /** 写入 四元数 数据
             * @param {Quat} data 四元数数据
             * @return {Rotate_3D} 返回this
             */
            set__Quat(data){
                copy_Array(this._quat,data,4);
            }

            /** 写入 矩阵   数据
             * @param {Matrix_3} data 矩阵数据
             * @return {Rotate_3D} 返回this
             */
            set__Matrix(data){
                copy_Array(this._matrix,data,9);
            }

            /** 使用 欧拉角 刷新数据 */
            reset__EulerAngles(){
                // todo
            }

            /** 使用 四元数 刷新数据 */
            reset__QUAT(){
                // todo 
            }

            /** 使用 矩阵   刷新数据 */
            reset__Matrix(){
                // todo
            }

            /** 创建逆旋转 矩阵
             * @return {Matrix_3} 返回旋转矩阵的逆矩阵(转置)
             */
            create_Inverse__Matrix(){
                return Matrix.create_Transposed(this._matrix);
            }

            /** 创建逆旋转 欧拉角
             * @return {[EulerAngles,Int8Array]} 返回逆旋转的欧拉角
             */
            create_Inverse__EulerAngles(){
                var v=this._euler_angles,
                    a=this._euler_angles_axis;
                return [
                    new EulerAngles([-v[2],-v[1],-v[0]]),
                    new Int8Array([a[2],a[1],a[0]])
                ];
            }
            
            /** 创建逆旋转 四元数
             * @return {Quat} 返回逆旋转的四元数
             */
            create_Inverse__EulerAngles(){
                // todo
            }
        }
        /** 欧拉角 */
        class EulerAngles extends CONFIG.VALUE_TYPE{

            /**
             * @param {List_Value} data 欧拉角旋转数据 
             */
            constructor(data){
                super([data[0],data[1],data[2]]);
            }

            /** 使用矩阵计算出欧拉角
             * @param {Matrix_3} m 仅做过旋转变换的矩阵
             * @param {int}  [_axis]    旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)
             * @return {EulerAngles}
             */
            static create_FromMatrix(m){
                // todo
            }

            /** 使用四元数
             * @param {Quat} quat       四元数
             * @param {int}  [_axis]    旋转轴顺序 [z,x,y] 默认为 [0,1,2](BPH)(zxy)
             * @return {EulerAngles}
             */
            static create_FromQUAT(m){
                // todo
            }
        }

        /** 四元数 */
        class Quat extends CONFIG.VALUE_TYPE{
            
            /** 使用矩阵计算出欧拉角
             * @param {Matrix_3} m 仅做过旋转变换的矩阵
             * @return {EulerAngles}
             */
             static create_FromMatrix(m){
                // todo
            }

            /** 使用四元数
             * @param {Quat} m 仅做过旋转变换的矩阵
             * @return {EulerAngles}
             */
            static create_FromEulerAngles(m){
                // todo
            }

        }
    // end  * 旋转 * end 

    // open * 变换矩阵控制器 * open
        // open * 3d 变换矩阵控制器 * open
            
            /** 3d 变换矩阵控制器 */
            class Transform_3D_Matrix_Ctrl{
                /** 
                 * @param {Hand__Transform_3D_Matrix_Ctrl[]} process 
                 */
                constructor(process){
                    /** @type {Hand__Transform_3D_Matrix_Ctrl[]} 变换过程 */
                    this.process=Object.assign({},process);
                    /** @type {Matrix} 4x4 矩阵,缓存的变换矩阵 */
                    this._mat=new Matrix(16);
                }

                /** 获取变换矩阵
                 * @return {Matrix} 返回一个新的矩阵
                 */
                get_Matrix(){
                    return new Matrix(this._mat);
                }
                
                /** 获取当前控制器的 变换矩阵的引用
                 * @return {Matrix} 返回 this._mat
                 */
                get_Matrix__Life(){
                    return this._mat;
                }
            }
            
            /** 3d 变换矩阵控制器 单个变换操作 */
            class Hand__Transform_3D_Matrix_Ctrl{
                /** 
                 * @param {Number|String} type 
                 * @param {*} params 
                 */
                constructor(type,params){
                    /** @type {Number} */
                    this._type=type;
                    if(type.constructor!==Number){
                        this._type=Hand__Transform_3D_Matrix_Ctrl.MAPPING__HAND_NO_TO_TYPE_NAME.indexOf(type);
                    }
                    this.params=params;
                }

                /**
                 * @param {Hand__Transform_3D_Matrix_Ctrl} tgt 拷贝对象
                 * @return {Hand__Transform_3D_Matrix_Ctrl}
                 */
                copy(tgt){
                    // todo
                }

                /** @type {String[]} 操作类型映射表 */
                static MAPPING__HAND_NO_TO_TYPE_NAME=[
                    // todo
                    "translate",
                    "size",
                    "rotate",
                    "pojection",
                    "shear",
                    "horizontal"
                ]
            }
        // end  * 3d 变换矩阵控制器 * end 
    // end  * 变换矩阵控制器 * end 

// end  * 基础图形学 * end 

// open * 贝塞尔曲线 * open

    /** 求贝塞尔曲线 pt 点 (DeCasteljau算法)  
     * 算法代码来自 https://pomax.github.io/bezierinfo/zh-CN/index.html
     * @param {{x:Number,y:Number}[]} points 控制点集合
     * @param {Number} t t参数
     * @returns {{x:Number,y:Number}} 返回对应点
     */
    function get_BezierCurvePoint__DeCasteljau(points,t){
        if(points.length>1){
            var newPoints=new Array(points.length-1);
            var x,y;
            var td=1-t;
            for(var i=newPoints.length-1;i>=0;--i){
                x=td*points[i].x+t*points[i+1].x;
                y=td*points[i].y+t*points[i+1].y;
                newPoints[i]={x:x,y:y};
            }
            return get_BezierCurvePoint__DeCasteljau(newPoints,t);
        }else{
            return points[0];
        }
    }
    /*h*/ /** @type {Number[][]} 缓存的贝塞尔曲线计算矩阵 */
    /*h*/ const _BEZIER_MATRIXS=[[1]];
    /** 获取贝塞尔曲线的计算矩阵 
     * @param {Number} n n阶贝塞尔曲线
     * @returns {Number[][]} 贝塞尔曲线的计算矩阵
     */
    function get_BezierMatrix(n){
        if(_BEZIER_MATRIXS[n])return _BEZIER_MATRIXS[n];

        if(G_PASCALS_TRIANGLE.length<=n)calc_PascalsTriangle(n);
        var i,j,f;
        var m=new Array(n+1);
        for(i=n;i>=0;--i){
            m[i]=new Array(i+1);
            for(j=i,f=1;j>=0;--j){
                m[i][j]=G_PASCALS_TRIANGLE[i][j]*G_PASCALS_TRIANGLE[n][i]*f;
                f*=-1;
            }
        }
        _BEZIER_MATRIXS.length=n+1;
        _BEZIER_MATRIXS[n]=m;
        return m;
    }

    /** 贝塞尔曲线控制点求各次幂的系数
     * @param {Number[]} points 控制点集合
     * @returns {Number[]} 贝塞尔曲线采样计算系数
     */
    function get_BezierCoefficient(points){
        var n=points.length-1;
        var m=get_BezierMatrix(n);
        var rtn=new Array(points.length);
        var i,j,temp;
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=m[i][j]*points[j];
            }
            rtn[i]=temp;
        }
        return rtn;
    }

    /** 求贝塞尔曲线的导函数的控制点 (一维)
     * @param {Number[]} points 原曲线的控制点集合 
     * @returns {Number[]} 导函数的控制点
     */
    function get_BezierDerivativesPoints(points){
        var n=points.length-2;
        var rtn=new Array(n+1);
        if(n<0)return {x:0,y:0}
        for(var i=n;i>=0;--i){
            rtn[i]=n*(points[i+1]-points[i])
        }
        return rtn;
    }

    /** 计算贝塞尔曲线分割时使用的 Q 矩阵 (不补零)
     * @param {Number} n  n阶贝塞尔曲线
     * @param {Number} t  t参数 0~1
     * @returns {Number[][]} 贝塞尔曲线的计算分割时使用的矩阵
     */
    function create_CutBezierMatrixQ(n,t){
        if(G_PASCALS_TRIANGLE.length<=n){
            calc_PascalsTriangle(n);
        }
        var i,j,k;
        var rtn=new Array(n+1);
        for(i=n;i>=0;--i){
            rtn[i]=G_PASCALS_TRIANGLE[i].concat();
        }
        var temp=t,
            td=t-1;
        // i 是行下标, j 是列下标
        for(i=1;i<=n;++i,temp*=t){
            for(j=i;j<=n;++j){
                rtn[j][i]*=temp;
            }
        }
        temp=-td;
        for(i=n-1;i>=0;--i,temp*=-td){
            for(j=i,k=n;j>=0;--j,--k){
                rtn[k][j]*=temp;
            }
        }
        return rtn;
    }

    /** 用矩阵分割贝塞尔曲线
     * @param {Number[]} points        控制点集合
     * @param {Number[][]} matrix 分割时使用的矩阵, 用 create_CutBezierMatrixQ 函数生成
     * @param {Boolean} flag 前后两边 false(0)为p1起点, true(!0)为p4终点
     * @return {Number[]} 返回两组控制点
     */
    function cut_Bezier__ByMatrix(points,matrix,flag){
        var n=points.length-1,
            i,j,
            rtn=new Array(points.length),
            temp;

        //j是行下标 i是列下标
        if(flag){
            // pt起点, p4终点
            for(i=n;i>=0;--i){
                temp=0;
                for(j=i;j>=0;--j){
                    temp+=points[n-j]*matrix[i][i-j];
                }
                rtn[n-i]=temp;
            }
        }else{
            // p1起点, pt终点
            for(i=n;i>=0;--i){
                temp=0;
                for(j=i;j>=0;--j){
                    temp+=points[j]*matrix[i][j];
                }
                rtn[i]=temp;
            }
        }
        return rtn;
    }

    /** 通过系数创建贝塞尔曲线控制点
     * @param {Number[]}    coefficient 采样点计算系数
     * @returns {Number[]}  返回控制点
     */
    function calc_BezierCtrlPoints__ByCoefficientTo(coefficient){
        var n=coefficient.length,
            rtn=new Array(n),
            m=get_BezierMatrix(--n),
            temp;
        
        for(var i=0;i<=n;++i){
            temp=coefficient[i];
            for(var j=0;j<i;++j){
                temp-=rtn[j]*m[i][j]
            }
            rtn[i]=temp/m[i][j];
        }
        return rtn;
    }
    //```javascript
    // 二维平面贝塞尔曲线拟合圆弧公式
    // 单位圆且起点角度为0   示例
    // p1=(1,0)
    // p2=(1,k)     //p1 + (k*导向量)
    // p3=p4 + (-k*导向量)
    // p4=采样点
    //```

    /*h*/const _DIVISION_4_3=4/3;
    /** 计算 贝塞尔曲线拟合圆弧 的 k 值
     * @param   {Number} angle 夹角
     * @returns {Number} 返回 k 值
     */
    function calc_k__BezierToCyles(angle){
        return _DIVISION_4_3*tan(angle*0.25);
    }

    /**@type {Number} 贝塞尔曲线拟合四分之一圆 的 k 值 */
    const BEZIER_TO_CYCLES_K__1D4=0.551784777779014;

// end  * 贝塞尔曲线 * end 

//# 导出
export{
    CONFIG as NML_CONFIG,
    DEG,
    DEG_90,
    DEG_180,
    CYCLES,

    calc_PascalsTriangle,
    get_PascalsTriangle,
    derivative,
    solve_BinaryLinearEquation,
    calc_rootsOfCubic,

    get_BezierCurvePoint__DeCasteljau,
    get_BezierMatrix,
    get_BezierCoefficient,
    get_BezierDerivativesPoints,
    create_CutBezierMatrixQ,
    cut_Bezier__ByMatrix,
    calc_BezierCtrlPoints__ByCoefficientTo,
    calc_k__BezierToCyles,
    BEZIER_TO_CYCLES_K__1D4,

    Vector,
    Matrix,
    Matrix_2,
    Matrix_3,
    copy_Array
}

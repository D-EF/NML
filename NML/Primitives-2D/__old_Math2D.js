/*
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-08-10 20:17:41
 */
/** 提供一点点2d数学支持的js文件
 * 如无另外注释，在这个文件下的所有2d坐标系都应为  x轴朝右, y轴朝上 的坐标系
 */
 
import {
    getBezierMatrix,
    create_CutBezierMatrixQ,
    cut_Bezier__ByMatrix,
    binaryLinearEquation,
    approximately,
    derivative,
    rootsOfCubic,
    coefficientToPoints,
    Stepper,
    calcPascalsTriangle,
    getPascalsTriangle,
    deg,
    deg_90,
    cycles,
    calc_k__BezierToCyles,
    BEZIER_TO_CYCLES_K__1D4,
} from "../basics/math_ex.js";

import {
    canBeNumberChar,
    DEF_Caller,
    Delegate,
    Iterator__Tree,
    Overload_Function,
    select_Lut__Binary,
} from "../basics/Basics.js";
/** 放了一点2d静态函数
 */
class Math2D{
    /** 旋转的单位向量
     * @param {number} angle 旋转弧度
     * @return  {Vector2} 返回一个单位向量
     */
    static rotateVector2(angle){
        return (new Vector2(Math.cos(angle),Math.sin(angle)))
    }
    /** 计算线段长度
     * @param {Vector2} v1 线段端点
     * @param {Vector2} v2 线段端点
     * @return {number} 返回线段长度
     */
    static get_LineLength(v1,v2){
        var a=v2.x-v1.x,
            b=v2.y-v1.y;
        return Math.sqrt(a*a+b*b);
    }
    /** 取向量和x正方向的弧度
     * @param {Vector2} v 坐标
     */
    static get_Angle(v){
        return Math.atan2(v.y,v.x);
    }
    /**
     * 水平翻转角度值
     */
    static angleFlipHorizontal(angle){
        if(angle>Math.PI){
            return 3*Math.PI-angle
        }else{
            return Math.PI-angle;
        }
    }

    /** 将相同起点终点的弧度变成更长的
     * @param {number} angle_a 端点弧度 取值范围在 -PI~PI
     * @param {number} angle_b 端点弧度 取值范围在 -PI~PI
     * @return {number[]}
     */
    static toLargeArc(angle_a,angle_b){
        var a=angle_a,b=angle_b;
        if(a<b){
            a+=Math.PI*2;
        }else{
            b+=Math.PI*2;
        }
        return [a,b];
    }
    /** 点在线段上的投影
     * @param {Vector2} point   点
     * @param {Vector2} lp1     线段起点
     * @param {Vector2} lp2     线段终点
     * @return {number} 投影系数
     */
    static get_PointInLine(point,lp1,lp2){
        var tp1=Vector2.dif(point,lp1),
            tp2=Vector2.dif(lp2,lp1);
        return Vector2.dot(tp1,tp2)/tp2.get_Mag();
    }
    /** 用时间参数t获取线段上的点
     * @param {Vector2} lop 线段起点  
     * @param {Vector2} led 线段终点  
     * @param {number} t  时间参数t
     * @return {Vector2} 返回线段上的点
     */
    static sample_Line(lop,led,t){
        var td=1-t,
            x=lop.x*td+led.x*t,
            y=lop.y*td+led.y*t;
        return new Vector2(x,y);
    }
    /** 点到线段的距离
     * @param {Vector2} point 点
     * @param {Vector2} line_p1 线段端点
     * @param {Vector2} line_p2 线段端点
     * @return {number} 返回点到线段的距离
     */
    static get_DistanceOfPointToLine(point,line_p1,line_p2){
        var d1=Vector2.dif(line_p2,line_p1),
            d2=Vector2.dif(point,line_p1),
            k=Vector2.dot(d1,d2)/(d1.x*d1.x+d1.y*d1.y),
            d=k>0?k<1?Vector2.sum(line_p1,Vector2.np(d1,k)):line_p2:line_p1;
        return Math2D.get_LineLength(point,d);
    }
    /** 与 get_distanceOfPointToLine 相似, 多返回个 k 值(点在线上的投影的系数)
     * @return {length:number,k:number}
     */
    static get_distanceOfPointToLine_k(point,line_p1,line_p2){
        var d1=Vector2.dif(line_p2,line_p1),
            d2=Vector2.dif(point,line_p1),
            k=Vector2.dot(d1,d2)/(d1.x*d1.x+d1.y*d1.y),
            d=k>0?k<1?Vector2.sum(line_p1,Vector2.np(d1,k)):line_p2:line_p1;
        return {length:Math2D.get_LineLength(point,d),k:k};
    }
    /** 判断两个圆形是否相交
     * @param {Vector2} c1  圆1 圆心坐标
     * @param {number} r1   圆1 半径
     * @param {Vector2} c2  圆2 圆心坐标
     * @param {number} r2   圆2 半径
     * @return {boolean} 返回相交情况
     */
    static get_intersectionOfCircleCircle_f(c1,r1,c2,r2){
        var l=Vector2.dif(c2,c1).get_Mag(),
            l1=r1+r2,
            l2=Math.abs(r1-r2);
        if(l>l1||l<l2){
            return false;
        }
        return true;
    }
    /** 获得两个圆形的交点
     * @param {Vector2} c1  圆1 圆心坐标
     * @param {number} r1   圆1 半径
     * @param {Vector2} c2  圆2 圆心坐标
     * @param {number} r2   圆2 半径
     * @return {Vector2[]} 返回交点
     */
    static get_intersectionOfCircleCircle_V(c1,r1,c2,r2){
        var d=Vector2.dif(c2,c1).get_Mag(),
            a=(r1*r1-r2*r2+d*d)/(2*d),
            fv=r1*r1-a*a;

        if(fv<0){
            return [];
        }

        var x0=c1.x+(a/d)*(c2.x-c1.x),
        y0=c1.y+(a/d)*(c2.y-c1.y),
        h=Math.sqrt(fv);
        
        var x1=x0-h*(c2.y-c1.y)/d,
            y1=y0+h*(c2.x-c1.x)/d,
            x2=x0+h*(c2.y-c1.y)/d,
            y2=y0-h*(c2.x-c1.x)/d;

        return [
            new Vector2(x1,y1),
            new Vector2(x2,y2)
        ];
    }
    /** 弧形是否相交
     * @param {Data_Arc} arc1 弧形1
     * @param {Data_Arc} arc2 弧形2
     * @return {boolean} 返回相交情况
     */
    static get_intersectionOfArcArc_f(arc1,arc2){
        var cis=Math2D.get_intersectionOfCircleCircle_V(arc1.c,arc1.r,arc2.c,arc2.r);
        var rtn=[];
        var f=arc.angle>Math.PI;
        var a1c=cis[i].dif(arc1.c),
            a2c=cis[i].dif(arc2.c);
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.get_VetorInAngle(arc1.opv,arc1.edv,a1c,f)&&
               Math2D.get_VetorInAngle(arc2.opv,arc2.edv,a2c,f)){
                rtn.push(cis[i]);
            }
        }
        return rtn;
    }
    /** 获得圆形和线段 的 交点 坐标
     * @param {Vector2} lop 线段起点
     * @param {Vector2} led 线段终点
     * @param {Vector2} c   圆心
     * @param {number}  r   圆形的半径
     * @return {Vector2[]} 长度最多为2的数组, 交点的坐标
     */
    static get_intersectionOfCircleLine_V(lop,led,c,r) {
        var d=Vector2.dif(led,lop);
        var f=Vector2.dif(lop,c);
        var a = d.dot(d);
        var b = 2 * f.dot(d);
        var c = f.dot(f) - r * r;
        var rtn=[];
        var discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return rtn;
        } else {
            discriminant = Math.sqrt(discriminant);
            var t1 = (-b - discriminant) / (2 * a);
            var t2 = (-b + discriminant) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                rtn.push(d.np(t1).sum(lop));
            }

            if (t2 >= 0 && t2 <= 1) {
                rtn.push(d.np(t2).sum(lop));
            }
            return rtn;
        }
    }
    /** 判断 tgtv 是否在 顺时针旋转 op 到 ed 的夹角内, 角不会超过360度 
     * @param {Vector2} angle_op_V    夹角的射线 开始
     * @param {Vector2} angle_ed_V    夹角的射线 结束
     * @param {Vector2} tgtv        目标
     * @param {Boolean} f 表示角度的大小是否大于半圆
     * @param {Boolean} f1 半圆时使用，表示是顺时针还是逆时针
     */
    static get_VetorInAngle(angle_op_V,angle_ed_V,tgtv,f){
        var v1=angle_op_V.copy(),v2=angle_ed_V.copy();
        // v1.y*=-1;
        // v2.y*=-1;
        if(!f){
            if((Vector2.cross(v1,tgtv)>=0)&&(Vector2.cross(v2,tgtv)<=0)){
                return true;
            }
        }else{
            if((Vector2.cross(v1,tgtv)>=0)||(Vector2.cross(v2,tgtv)<=0)){
                return true;
            }
        }
        
        return false;
    }
    /** 获得弧形与线段的交点
     * @param {Data_Arc} arc    弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @return {Vector2[]} 弧形与线段的交点
     */
    static get_intersectionOfArcLine_V(arc,lop,led){
        var cis=Math2D.get_intersectionOfCircleLine_V(lop,led,arc.c,arc.r);
        var rtn=[];
        var f=arc.angle>Math.PI;
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.get_VetorInAngle(arc.opv,arc.edv,cis[i].dif(arc.c),f)){
                rtn.push(cis[i]);
            }
        }
        return rtn;
    }
    /** 判断弧形与线段是否相交
     * @param {Data_Arc} arc    弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @return {boolean} 相交情况
     */
    static get_intersectionOfArcLine_f(arc,lop,led){
        var cis=Math2D.get_intersectionOfCircleLine_V(lop,led,arc.c,arc.r);
        var opv=arc.opv,edv=arc.edv;
        
        if(arc.angle>=2*Math.PI)return true;
        var f=arc.angle>Math.PI;
        for(var i =cis.length-1;i>=0;--i){
            if(Math2D.get_VetorInAngle(opv,edv,cis[i].dif(arc.c),f)){
                return true;
            }
        }
        return false;
    }
    /** 扇形与线段是否相交
     * @param {Data_Sector} sector     弧形数据
     * @param {Vector2} lop     线段端点
     * @param {Vector2} led     线段端点
     * @return {boolean} 相交情况
     */
    static get_intersectionOfSectorLine_f(sector,lop,led){
        if(Math2D.get_intersectionOfArcLine_f(sector,lop,led)){
            return true
        }
        return( Math2D.get_intersectionOfLineLine_f(lop,led,sector.c.sum(sector.opv),sector.c)||
                Math2D.get_intersectionOfLineLine_f(lop,led,sector.c.sum(sector.edv),sector.c)
        );
    }
    /** 判断两条线段相交情况
     * @param {Vector2} l1op    线段1的起点
     * @param {Vector2} l1ed    线段1的终点
     * @param {Vector2} l2op    线段2的起点
     * @param {Vector2} l2ed    线段2的终点
     * @return{number} 返回 1 表示相交; 0 表示没有相交; -1 表示 l1 终点在 l2 上, 或者 l2 起点在 l1 上; 2 表示 l2 终点在 l1 上, 或者 l1 起点在 l2 上; 
     */
    static get_intersectionOfLineLine_f(l1op,l1ed,l2op,l2ed){
        var temp1=Vector2.dif(l1ed,l1op),
            t1o=Vector2.dif(l1ed,l2op),
            t1e=Vector2.dif(l1ed,l2ed);
        var temp2=Vector2.dif(l2ed,l2op),
            t2o=Vector2.dif(l2ed,l1op),
            t2e=Vector2.dif(l2ed,l1ed);
        // fx   x是线段号码 (1 or 2)
        // fx1 是起点的 flag, fx2 是终点的 flag
        var f11=Vector2.cross(temp1,t1o),
            f12=Vector2.cross(temp1,t1e);
        var f21=Vector2.cross(temp2,t2o),
            f22=Vector2.cross(temp2,t2e);
        
        if((f11==0)&&((f22>0)!=(f21>0))){
            // l1 起点在 l2 上
            return 2;
        }
        else if((f12==0)&&((f22>0)!=(f21>0))){
            // l1 终点在 l2 上
            return -1;
        }else if((f21==0)&&((f11>0)!=(f12>0))){
            // l2 起点在 l1 上
            return -1;
        }
        else if((f22==0)&&((f11>0)!=(f12>0))){
            // l2 终点在 l1 上
            return 2;
        }
        
        if((f11>0)!=(f12>0)&&(f22>0)!=(f21>0)){
            // 两线段相交
            return 1;
        }
        return 0;
    }
    /** 求线段交点坐标
     * @param {number} x1 线段a端点1 x坐标
     * @param {number} y1 线段a端点1 y坐标
     * @param {number} x2 线段a端点2 x坐标
     * @param {number} y2 线段a端点2 y坐标
     * @param {number} x3 线段a端点1 x坐标
     * @param {number} y3 线段a端点1 y坐标
     * @param {number} x4 线段a端点2 x坐标
     * @param {number} y4 线段a端点2 y坐标
     * @return {x:number,y:number} 如果返回 Infinity 或 -Infinity 则为未相交
     */
    static get_intersectionOfLineLine_v(x1,y1,x2,y2,x3,y3,x4,y4){
        var bx=x2-x1,
            by=y2-y1,
            dx=x4-x3,
            dy=y4-y3;
        var t=binaryLinearEquation(x1,bx,x3,dx,y1,by,y3,dy);
                if(isNaN(t.x)||isNaN(t.x)){
            // 共线时为 NaN, 未相交时为 Infinity
            // 暂不处理共线，视作未相交
            return {x:Infinity,y:Infinity};
        }
        if(t.x<=1&&t.x>=0&&t.y<=1&&t.y>=0){
            return {x:t.x*bx+x1,y:t.x*by+y1};
        }else{
            return {x:Infinity,y:Infinity};
        }
        return {x:t.x*bx+x1,y:t.x*by+y1};
    }
    /** 求贝塞尔曲线的导函数的控制点
     * @param {{x:number,y:number}[]} points 原曲线的控制点集合 
     * @return {{x:number,y:number}[]} 导函数的控制点
     */
    static get_BezierDerivativesPoints(points){
        var n=points.length-1,
            i=n-1,
            rtn=new Array(i);
        if(n<0)return {x:0,y:0}
        for(;i>=0;--i){
            rtn[i]={
                x:n*(points[i+1].x-points[i].x),
                y:n*(points[i+1].y-points[i].y)
            }
        }
        return rtn;
    }
    /** 二维中的贝塞尔曲线分割
     * @param {Vector2[]} points 控制点集合
     * @param {number} t t时间参数
     * @return {Vector2[][]} 返回新的两组贝塞尔曲线的点
     */
    static get_CutOffBezierCurve(points,t){
        var l=points.length,
            q=create_CutBezierMatrixQ(l-1,t),
            points_x=new Array(l),
            points_y=new Array(l);
        for(var i = l-1;i>=0;--i){
            points_x[i]=points[i].x;
            points_y[i]=points[i].y;
        }
        return [
            Vector2.create_ByArray(
                cut_Bezier__ByMatrix(points_x,q),
                cut_Bezier__ByMatrix(points_y,q)
            ),
            Vector2.create_ByArray(
                cut_Bezier__ByMatrix(points_x,q,true),
                cut_Bezier__ByMatrix(points_y,q,true)
            )
        ];
    }

    /** 判断三阶以下的贝塞尔曲线 t取值范围内曲线是否单调
     * @param {Vector2[]} points 贝塞尔曲线的控制点
     * @return {{x:Boolean,y:Boolean}} t取值范围内曲线是否单调 true为单调
     */
    static get_BezierCurveIsMonotonicity(points){
        if(points.length>4) return {};
        var l=points.length-1,
            i,
            x=true,y=true;
        for(i=l-1;i>0&&(x||y);--i){
            x=((points[l].x>points[i].x)!==(points[0].x>points[i].x))||(points[0].x===points[i].x)||(points[l].x===points[i].x);
            y=((points[l].y>points[i].y)!==(points[0].y>points[i].y))||(points[0].y===points[i].y)||(points[l].y===points[i].y);
        }
        return {x:x,y:y};
    }

    /** 获取曲线和线段相交的点的坐标
     * @param {Vector2} v1      线段起点
     * @param {Vector2} v2      线段终点
     * @param {BezierCurve} bezierCurve   贝塞尔曲线实例
     * @return {Vector2[]} 返回交点的集合(数组)
     */
    static get_intersectionOfLineBezier_v(v1,v2,bezierCurve){
        var temp=BezierCurve.copy(bezierCurve),
            nd=Vector2.dif(v2,v1).normalize(),
            m=Matrix2x2T.create_ByVector2(nd).set_Translate(-v1.x,-v1.y);
        var tv2=Vector2.linearMapping(m,v2,true)
        temp.linearMapping(m,false,true);
        
        var ts=temp.get_t_ByY(0),
        tv,
        rtn=[];
        for(var i=ts.length-1;i>=0;--i){
            tv=temp.sample(ts[[i]]);
            if((tv.x>0&&tv.x<tv2.x)||(tv.x>tv2.x&&tv.x<0)){
                rtn.push(tv);
            }
        }
        return rtn;
    }
    /** box线框相交情况
     * @param {Vector2} va1 矩形a的向量1
     * @param {Vector2} va2 矩形a的向量2
     * @param {Vector2} vb1 矩形b的向量1
     * @param {Vector2} vb2 矩形b的向量2
     * @return {boolean} 返回是否相交
     */
    static get_intersectionOfBoxBox_f(va1,va2,vb1,vb2){
        return  (((va1.x>vb1.x)!==(va1.x>vb2.x))||((va2.x>vb1.x)!==(va2.x>vb2.x))||((vb1.x>va1.x)!==(vb1.x>va2.x))||((vb2.x>va1.x)!==(vb2.x>va2.x)))&&
                (((va1.y>vb1.y)!==(va1.y>vb2.y))||((va2.y>vb1.y)!==(va2.y>vb2.y))||((vb1.y>va1.y)!==(vb1.y>va2.y))||((vb2.y>va1.y)!==(vb2.y>va2.y)));
    }
    
    /** 使用曲线的根将曲线变成单调的多条曲线
     * @param {BezierCurve} bezier1 
     * @return {BezierCurve[]} 返回多条曲线
     */
    static get_cutOffBezierToUnilateral_ByRoot(bezier1){
        var f=this.get_BezierCurveIsMonotonicity(bezier1.points);
        if(f.x&&f.y){
            return [bezier1];
        }
        var ts=bezier1.get_root_t(1);
        var i,j,temp,l=ts.length-1;
        for(i=l;i>=0;--i){
            for(j=l-i;j>0;--j){
                if(ts[j]<ts[j-1]){
                    temp=ts[j];
                    ts[j]=ts[j-1];
                    ts[j-1]=temp;
                }
            }
        }
        
        var rtn=[];
        i=0;
        while(approximately(ts[i],0))++i;
        var temp1=Math2D.get_CutOffBezierCurve(bezier1.points,ts[i]);
        l=i;
        rtn.push(new BezierCurve(temp1[0]));

        for(++i;i<ts.length;++i){
            if(approximately(ts[i],0)||approximately(ts[i],1)){
                continue;
            }
            temp1=Math2D.get_CutOffBezierCurve(temp1[1],(ts[i]-ts[l])/(1-ts[l]));
            rtn.push(new BezierCurve(temp1[0]));
            l=i;
        }
        rtn.push(new BezierCurve(temp1[1]));

        return rtn;
    }
    /** x方向射线 与 线段 判断相交情况
     * @param {number} x 射线起点
     * @param {number} y 射线起点
     * @param {Vector2} v1 线段端点
     * @param {Vector2} v2 线段端点
     * @return {number} 射线穿过情况
     */
    static get_intersectionOfXRadialLine_Fn(x,y,v1,v2){
        if(v1.x==x&&v1.y==y) return 1;//如果正好在顶点上直接算在内部
        if(v2.x==x&&v2.y==y) return -1;//如果正好在顶点上直接算在内部
        var tempK,temp;
        if((v1.y>=y)!=(v2.y>=y)){
            // 点的 y 坐标 在范围内
            tempK=((temp=v2.y-v1.y)?
                    (((v2.x-v1.x)*(y-v1.y))/(temp)+v1.x):
                    (v1.x)
                );
            if(x==tempK){
                // 斜率相等, 点在边线上 直接算内部
                return 1;
            }
            else if(x>tempK){
                // 射线穿过
                return 1;
            }
        }
        return 0;
    }
    /** 射线穿过曲线次数
     * @param {number} x 射线起点
     * @param {number} y 射线起点
     * @param {BezierCurve} bezier 曲线实例
     * @return {number} 射线穿过曲线次数 返回-1代表点正好在曲线坐标上
     */
    static get_intersectionOfXRadialBezier_n(x,y,bezier){
        var nbs=bezier.get_t_ByY(y),tx,rtn=0;
        for(var i=nbs.length-1;i>=0;--i){
            if(x>(tx=bezier.sample_x(nbs[i]))){
                ++rtn;
            }else if(x===tx){
                return -1;
            }
        }
        return rtn;
    }
    /** 贝塞尔曲线求交
     * @param {BezierCurve} bezier1 贝塞尔曲线1
     * @param {BezierCurve} bezier2 贝塞尔曲线2
     * @param {number} _accuracy 采样临界值(最终包围框的宽高最大不超过) 默认 1 值越小精度越高
     * @param {Boolean} f_lil 是否使用最后得到的向量配对进行交点计算, 默认为true, 注意 如果采样精度太低进行求交可能会导致交点丢失
     * @return {Vectore2[]}  返回交点的集合
     */
    static get_intersectionOfBezierBezier_f(bezier1,bezier2,_accuracy,f_lil){
        /**@type {BezierCurve[][]} 两条曲线的单调子曲线*/
        var group_bezier=[Math2D.get_cutOffBezierToUnilateral_ByRoot(bezier1),Math2D.get_cutOffBezierToUnilateral_ByRoot(bezier2)],
            l=group_bezier[0].length-1,
            k=group_bezier[1].length-1,
            i,j;
        /**@type {number} 精度 */
        var accuracy=(_accuracy&&(_accuracy>0))?_accuracy:1;
        /**@type {Unilateral_Bezier_Box[]} 用来配对的集合*/
        var group=new Array(l),
        /**@type {Unilateral_Bezier_Box[]} 暂存*/
        temp_group=new Array(k);
        var tempVector2;
        
        for(j=k;j>=0;--j){
            temp_group[j]=new Unilateral_Bezier_Box(group_bezier[1][j]);
        }
        for(i=l;i>=0;--i){
            group[i]=new Unilateral_Bezier_Box(group_bezier[0][i]);
            group[i].sb=temp_group.concat();
        }
        for(j=k;j>=0;--j){
            temp_group[j].sb=group.concat();
        }
        var rtn=[],d=0,f=false;
        temp_group=[];
        while(group.length){
            ++d;
            f=false;
            // ctx.clearRect(0,0,1000,1000);
            for(i=group.length-1;(i>=0)&&group[i].sb.length;--i){
                group[i].weed_Out();
                if(!group[i].sb.length){
                    // 左组i项无配对
                    continue;
                }
                // tgt_d.render(ctx);
                // tgt_d1.render(ctx);
    
                if(group[i].has_Accuracy(accuracy)){
                    // 左组i项精度达成
                    f=true;
                    temp_group.push(group[i]);
                }else{
                    // 左组的精度不足 左组派生细分
                    temp_group=temp_group.concat(group[i].ex_Box());
                }
                for(j=0;j<group[i].sb.length;++j){
                    if(f&&group[i].sb[j].has_Accuracy(accuracy)){
                        // 精度都足够 剔除配对并增加返回
                        if(f_lil){
                            rtn.push(Math2D.get_CenterByVector2List([group[i].v1,group[i].v2,group[i].sb[j].v1,group[i].sb[j].v2]));
                        }
                        else{
                            tempVector2=group[i].get_intersectionOfLineLine_f(group[i].sb[j]);
                            if(!(isNaN(tempVector2.x)||(tempVector2.x===Infinity)||(tempVector2.x===-Infinity)||
                            isNaN(tempVector2.y)||(tempVector2.y===Infinity)||(tempVector2.y===-Infinity)))
                            rtn.push(tempVector2);
                        }
                        group[i].sb.splice(j,1);
                        --j;
                    }
                    else if(group[i].sb[j].iterations<d){
                        // 精度未达成 并且这次迭代中未细分
                        group[i].sb[j].ex_Box();
                        ++j;
                    }
                }
            }
            group=temp_group;
            temp_group=[];
        }
        return rtn;
    }
    /** 弧形和曲线相交
     * @param {Data_Arc} arc 
     * @param {BezierCurve} bezier 
     */
    static get_intersectionOfArcBezier_v(arc,bezier){
        var points=bezier.intersect_Circular(arc.c,arc.r);
        if(arc.angle<2*Math.PI){
            for(var i = points.length-1;i>=0;--i){
                if(!Math2D.get_VetorInAngle(arc.opv,arc.edv,points[i],arc.angle>Math.PI)){
                    points.splice(i,1);
                }
            }
        }
        return points;
    }
    /** 一组坐标的边界框的中心点
     * @param {Vector2[]} ordinates 坐标集合
     * @return {Vector2} 返回中心的坐标
     */
    static get_CenterByVector2List(vector2s){
        var min=new Vector2(),max=new Vector2();
        max.x=vector2s[0].x;
        max.y=vector2s[0].y;
        min.x=vector2s[0].x;
        min.y=vector2s[0].y;
    
        for(var i=vector2s.length-1;i>0;--i){
            if(vector2s[i].x>max.x)max.x=vector2s[i].x;
       else if(vector2s[i].x<min.x)min.x=vector2s[i].x;
            if(vector2s[i].y>max.y)max.y=vector2s[i].y;
       else if(vector2s[i].y<min.y)min.y=vector2s[i].y;
        }
    
        return new Vector2(0.5*(max.x-min.x),0.5*(max.y-min.y));
    }
    /** 曲线的阶数升高后的控制点
     * @param {Vector2p[]} 旧曲线的控制点数组
     * @return {Vector2p[]} 返回一个新曲线的控制点数组
     */
    static get_CurveOrderElevate(points){
        var i=points.length,
            new_point=[],
            new_p=getPascalsTriangle(i),
            old_p=getPascalsTriangle(i-1);
            
        new_point[0]=points[0];
        new_point[i]=points[i-1];
        --i;
        do{
            new_point[i]=Math2D.sample_Line(points[i-1],points[i],old_p[i]/new_p[i])
        }while(i);
        return new_point;
    }
    //  Bezier The projection identity 投影恒等式 数学内容来自 https://pomax.github.io/bezierinfo/zh-CN/index.html#abc 和 https://mathoverflow.net/questions/122257/finding-the-formula-for-bezier-curve-ratios-hull-point-point-baseline
    /** 贝塞尔曲线的t值对应的基线上的投影点C
     * @param {number} n n阶曲线
     * @param {number} t 曲线的时间参数t
     * @return {number} 基线的t参数
     */
    static get_bezierIdentityFormulaUt_Value(n,t){
        var td=1-t,
            tk,tdk;
        if(n===2){
            tk=t*t;
            tdk=td*td;
                        return tdk/(tk+tdk);
        }
        if(n===3){
            tk=t*t*t;
            tdk=td*td*td;
            return tdk/(tk+tdk);
        }
        // 目前没有更高阶的
    }
    /** 曲线投影的 BC:AB constant
     * @param {number} n n阶曲线
     * @param {number} t 曲线的时间参数t
     * @return {number} 基线的t参数
     */
    static get_bezierIdentityFormulaRatio_Value(n,t){
        var td=1-t,
            tk,tdk;
        if(n===2){
            tk=t*t;
            tdk=td*td;
            return Math.abs((tk+tdk-1)/(tk+tdk));
        }
        if(n===3){
            tk=t*t*t;
            tdk=td*td*td;
            return Math.abs((tk+tdk-1)/(tk+tdk));
        }
        // 目前没有更高阶的
    }
    /**使用三个点 创建 拟合二阶贝塞尔曲线
     * @param {Vector2} p1 起点
     * @param {Vector2} p2 中间的点
     * @param {Vector2} p3 终点
     * @return {BezierCurve} 返回一个二阶数学曲线对象
     */
    static create_QuadraticBezierBy3Point(p1,p2,p3,t){
        var d1=Math2D.get_LineLength(p1,p2),
            d2=Math2D.get_LineLength(p3,p2),
            _t=t instanceof Number?t:d1/(d1+d2);
        var C=Math2D.sample_Line(p3,p1,Math2D.get_bezierIdentityFormulaUt_Value(2,_t)),
            B=p2,
            A=Math2D.sample_Line(C,B,1+1/Math2D.get_bezierIdentityFormulaRatio_Value(2,_t));
        return new BezierCurve([p1,A,p3]);
    }
    /**使用三点创建拟合圆
     * @param {Vector2} p1 点1
     * @param {Vector2} p2 点2
     * @param {Vector2} p3 点3
     * @return {Data_Arc} 返回一个弧形数据, 该弧形的起点和终点弧度为0, 半径为负数表示无法创建圆
     */
    static create_CircleBy3Point(p1,p2,p3){
        var x1 = p1.x, x2 = p2.x, x3 = p3.x,
            y1 = p1.y, y2 = p2.y, y3 = p3.y,
            a  = x1 - x2,
            b  = y1 - y2,
            c  = x1 - x3,
            d  = y1 - y3,
            e  = ((x1 * x1 - x2 * x2) + (y1 * y1 - y2 * y2)) * 0.5,
            f  = ((x1 * x1 - x3 * x3) + (y1 * y1 - y3 * y3)) * 0.5,
            det = b * c - a * d;
        if(approximately(Math.abs(det),0))
        {
            return new Data_Arc(0,0,-1);
        }
    
        var det=1/det,
            x0 = -(d * e - b * f) * det,
            y0 = -(a * f - c * e) * det,
            radius = Math.hypot(x1 - x0, y1 - y0);
        return new Data_Arc(x0, y0,radius);
    }
    /**使用三个的点 创建 拟合三阶曲线
     * @param {Vector2} p1 起点
     * @param {Vector2} p2 中间的点
     * @param {Vector2} p3 终点
     * @param {number}  _t
     * @return 
     */
    static create_CubicBezierBy3Point(p1,p2,p3,_t){
        var d1=Math2D.get_LineLength(p1,p2),
            d2=Math2D.get_LineLength(p3,p2),
            d=Math2D.get_LineLength(p3,p1),
            t=_t instanceof Number?_t:d1/(d1+d2),
            td=1-t,
            t_d=1/t,
            td_d=1/td,
            ratio_d=1/Math2D.get_bezierIdentityFormulaRatio_Value(3,t),
            C=Math2D.sample_Line(p3,p1,Math2D.get_bezierIdentityFormulaUt_Value(3,t)),
            B=p2,
            A=Math2D.sample_Line(C,B,1+ratio_d),
            e1,e2,v1,v2,c1,c2,
            f,l,n,
            p2_1=Vector2.dif(p2,p1),
            p3_1=Vector2.dif(p3,p1),
            arc=Math2D.create_CircleBy3Point(p1,p2,p3);
            
        // B点切线方向
        n=Vector2.dif(arc.c,p2).linearMapping(Matrix2x2.ROTATE_90,false,false).normalize();
        // B点切线长度
        l=d/3;
        // B点在基线哪侧
        f=Vector2.cross(p3_1,p2_1)>0?1:-1;

        e1=Vector2.sum(p2,n.np(t*f*l));
        e2=Vector2.sum(p2,n.np(td*f*l*-1));
        
        v1=e1.dif(A.np(t)).np(td_d);
        v2=e2.dif(A.np(td)).np(t_d);

        c1=v1.dif(Vector2.np(p1,td)).np(t_d);
        c2=v2.dif(Vector2.np(p3,t)).np(td_d);
        
        return new BezierCurve([p1,c1,c2,p3]);
    }
}


/* 基础图形------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/** 矩形的数据
 */
class Data_Rect{
    /** @param {number} x 坐标
     * @param {number} y 坐标
     * @param {number} w 宽度
     * @param {number} h 高度
     */
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }
    static create_ByVector2(v1,v2){
        return new Data_Rect(
            v1.x,v1.y,
            v2.x-v1.x,
            v2.y-v1.y
        );
    }
    static copy(d){
        return new Data_Rect(
            d.x,
            d.y,
            d.w,
            d.h
        );
    }
    /** 拷贝函数
     * @return {Data_Rect} 返回一个当前对象的拷贝
     */
    copy(){
        return new Data_Rect(
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
    /** @return {Vector2} 返回图形最靠近 {0,0} 的顶点
     */
    get_Min(){
        var rtnx,rtny;
        if(this.w>=0){
            rtnx=this.x;
        }else{
            rtnx=this.x+this.w;
        }
        
        if(this.h>=0){
            rtny=this.y;
        }else{
            rtny=this.y+this.h;
        }
        return new Vector2(rtnx,rtny);
    }
    
    /** @return {Vector2} 返回图形最远离 {0,0} 的顶点
     */
    get_Max(){
        var rtnx,rtny;
        if(this.w<=0){
            rtnx=this.x;
        }else{
            rtnx=this.x+this.w;
        }
        
        if(this.h<=0){
            rtny=this.y;
        }else{
            rtny=this.y+this.h;
        }
        return new Vector2(rtnx,rtny);
    }
    /** 判断点是否在内部
     * @param {number} x 点的x坐标
     * @param {number} y 点的y坐标
     * @return {boolean} 返回 点是否在内部
     */
    is_Inside(x,y){
        var max=this.get_Max(),
            min=this.get_Min();
        return (x>min.x&&x<max.x&&y>min.y&&y<max.y);
    }
    /** 获取代理用的多边形
     * @return {Polygon} 返回一个多边形
     */
    create_PolygonProxy(){
        return Polygon.create_Rect(this.x,this.y,this.w,this.h);
    }
}

/** 弧形的图形数据
 */
 class Data_Arc{
     /** 旋转方向默认是顺时针, 并且 起点弧度 始终 会 小于 终点弧度
      * @param {number} cx 圆心坐标
      * @param {number} cy 圆心坐标
      * @param {number} r  半径
      * @param {number} angle_A     弧形端点弧度
      * @param {number} angle_B     弧形端点弧度
      */
    constructor(cx,cy,r,angle_A,angle_B){
        /**圆心的坐标 */
        this.c=new Vector2(cx,cy);
        /**圆半径 */
        this._r=r;
        this._startAngle=0;
        this._endAngle=0;

        //以下应该是只读的 只在 startAngle, endAngle 的访问器中修改

        this._opv=null;
        this._edv=null;
        this._min=null;
        this._max=null;
        /** @type {Polygon} 多边形拟合代理对象 */
        this._polygon_proxy=null;
        /** @type {number} 每个点相差的弧度 */
        this._polygon_proxy_want_sp=10*deg;
        this.polygon_proxy_sp=this._polygon_proxy_want_sp;

        /** @type {BezierCurve[]} 拟合圆的 贝塞尔曲线  */
        this._bezier_curve_proxy=[];
        // 访问器
        this.setAngle_AB(angle_A,angle_B);
    }
    /**刷新只读属性 */
    refresh_Cache(){
        /**弧形起点 */
        this._opv=null;
        /**弧形终点 */
        this._edv=null;
        this._max=null;
        this._min=null;        
        this._polygon_proxy=null;
        this._polygon_proxy_sp=0;
        this._length_long_lut=null;
        this._bezier_curve_proxy.length=0;
    }
    /** 获取导向量
     * @param {number} t t参数0~1
     * @return {Vector2} 返回一个向量
     */
    get_Tangent(t){
        var angle=this._startAngle*(1-t)+this._endAngle*t+deg_90;
        return this.get_Tangent__ByAngle(angle);
    }
    get_Tangent__ByAngle(angle){
        return Math2D.rotateVector2(angle).np(this.r);
    }
    /** 法线
     * @param {number} t t参数0~1
     * @return {Vector2} 返回一个标准化的相对坐标
     */
    get_Normal(t){
        var angle=this._startAngle*(1-t)+this._endAngle*t;
        return new Vector2(Math.cos(angle),Math.sin(angle));
    }
    /** 采样点
     * @param {number} t  0~1 时间参数t 
     * @return 
     */
    sample(t){
        var angle=this._startAngle*(1-t)+this._endAngle*t;
        var r= this.r;
        return (new Vector2(Math.cos(angle)*r,Math.sin(angle)*r)).translate(this.c);
    }
    /** 采样点 使用弧度采样
     * @param {number} angle  采样弧度
     * @return 
     */
    sample_ByAngle(angle){
        return (new Vector2(Math.cos(angle)*this.r,Math.sin(angle)*this.r)).translate(this.c);
    }
    /** 重设两个端点的弧度
     * @param {number} angle_A     弧形端点弧度
     * @param {number} angle_B     弧形端点弧度
     */
    setAngle_AB(angle_A,angle_B){
        this._startAngle=angle_A;
        this._endAngle=angle_B;
        this.reset_AngleStartEnd();
        this.refresh_Cache();
    }
    /**刷新起点终点的弧度; 较大的数会作为end */
    reset_AngleStartEnd(){
        if(this._startAngle>this._endAngle){
            var ta=this._startAngle;
            this._startAngle=this._endAngle;
            this._endAngle=ta;
        }
    }
    
    static copy(d){
        return new Data_Arc(
            d.c.x,
            d.c.y,
            d._r,
            d._startAngle,
            d._endAngle,
            );
    }
    /** 拷贝函数
     * @return {Data_Arc}
     */
    copy(){
        return this.constructor.copy(this);
    }
    /**弧形起点
     * @return {Vector2}
     */
    get opv(){
        if(!this._opv){
            this._opv=this.get_Opv();
        }
        return this._opv;
    }
    /**弧形终点
     * @return {Vector2}
     */
    get edv(){
        if(!this._edv){
            this._edv=this.get_Edv();
        }
        return this._edv;
    }
    /** 一个 刚好包裹 弧形 的 矩形 的 最大坐标
     * @return {Vector2}
     */
    get max(){
        if(!this._max){
            var mm=this.get_MinAmax();
            this._max=mm.max;
            this._min=mm.min;  
        }
        return this._max;
    }
    /**一个 刚好包裹 弧形 的 矩形 的 最小坐标
     * @return {Vector2}
     */
    get min(){
        if(!this._min){
            var mm=this.get_MinAmax();
            this._max=mm.max;
            this._min=mm.min;  
        }
        return this._min;
    }
    /** 夹角弧度 Angle 
     * @return {number}
     */
    get angle(){
        /**夹角弧度 */
        return Math.abs(this.startAngle-this.endAngle);
    }
    /** 录入 弧形起点的弧度 startAngle , 根据大小关系会修改起点和终点的顺序
     * @param {number} val
     */
    set startAngle(val){
        if(val.constructor===Number){
            this._startAngle=val;
            this.reset_AngleStartEnd();
            this.refresh_Cache();
            return this._startAngle;
        }else{
            throw new Error("错误的类型 ! Unexpected Type !");
        }
    }
    /** 录入 弧形终点的弧度 endAngle , 根据大小关系会修改起点和终点的顺序
     * @param {number} val
     */
    set endAngle(val){
        if(val.constructor===Number){
            this._endAngle=val;
            this.reset_AngleStartEnd();
            this.refresh_Cache();
            return this._endAngle;
        }else{
            throw new Error("错误的类型 ! Unexpected Type !");
        }
    }
    /** 录入 两个端点的弧度
     * @param {number} val1 端点的弧度
     * @param {number} val2 端点的弧度
     */
    set_EndpointAngle(val1,val2){
        if((val1.constructor!==Number)||(val2.constructor!==Number)){
            throw new Error("错误的类型 ! Unexpected Type !");
        }
        var f=val1>val2;
        this._startAngle=f?val2:val1;
        this._endAngle=f?val1:val2;
        this.refresh_Cache();
    }
    /** 读取 弧形起点的弧度 _startAngle
     */
    get startAngle(){
        return this._startAngle;
    }
    /** 读取 弧形终点的弧度 endAngle
     */
    get endAngle(){
        return this._endAngle
    }
    /** 录入半径
     */
    set r(val){
        this._r=val;
        this.refresh_Cache();
        return this._r;
    }
    /** 获取半径
     */
    get r(){
        return this._r;
    }
    /** 求弧长
     * @return {number} 弧长 */
    get_LengthLong(){
        return this.angle*this.r;
    }
    /** 重新计算起点和终点的坐标 (相对于圆心)
     */
    refresh_Oped(){
        /**弧形起点 */
        this.opv=this.get_Opv();
        /**弧形终点 */
        this.edv=this.get_Edv();
    }
    /** 获取起点的向量 (相对于圆心)
     */
    get_Opv(){
        var tempAngle=this.startAngle;
        var r= this.r;
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    /** 获取终点的向量 (相对于圆心)
     */
    get_Edv(){
        var tempAngle=this.endAngle;
        var r= this.r;
        
        return (new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
    }
    /** 获取一个 刚好包裹 弧形 的 矩形 的 x和y最小的顶点的 和 x和y最大的顶点 的 坐标
     * @return {{min:Vector2,max:Vector2}}
     */
    get_MinAmax(){
        if(this.angle>=2*Math.PI){
            return {
                min:new Vector2(this.c.x-this.r,this.c.y-this.r),
                max:new Vector2(this.c.x+this.r,this.c.y+this.r)
            };
        }
        var r= this.r;
        var a=this.opv,
            b=this.edv;
        var f=this.angle>Math.PI,
            f1=a.x>=0,
            f2=a.y>=0,
            f3=b.x>=0,
            f4=b.y>=0,
            f5=f1===f3,
            f6=f2===f4;

        var min=new Vector2(),
            max=new Vector2();

        if(f5&&f6){// 在同一象限
            if(f){// 大于半圆
                min.x=-r;
                min.y=-r;
                max.x=r;
                max.y=r;
            }else{
                min.x=(a.x>b.x)?(b.x):(a.x);
                min.y=(a.y>b.y)?(b.y):(a.y);
                max.x=(a.x<b.x)?(b.x):(a.x);
                max.y=(a.y<b.y)?(b.y):(a.y);
            }
        }else if(f2){// a1 || a2
            if(f1){
                if((!f3)&&(f4)){// a1 b2
                    min.x=b.x;
                    min.y=(a.y>b.y)?(b.y):(a.y);
                    max.x=a.x;
                    max.y=r;
                }else if((!f3)&&(!f4)){// a1 b3
                    min.x=-r;
                    min.y=b.y;
                    max.x=a.x;
                    max.y=r;
                }else if((f3)&&(!f4)){// a1 b4
                    min.x=-r;
                    min.y=-r;
                    max.x=(a.x<b.x)?(b.x):(a.x);
                    max.y=r;
                }
            }else{//a2
                if(f3&&f4){// a2 b1
                    min.x=-r;
                    min.y=-r;
                    max.x=r;
                    max.y=(a.y<b.y)?(b.y):(a.y);
                }else if((!f3)&&(!f4)){// a2 b3
                    min.x=-r;
                    min.y=b.y;
                    max.x=(a.x<b.x)?(b.x):(a.x);
                    max.y=a.y;
                }else if((f3)&&(!f4)){// a2 b4
                    min.x=-r;
                    min.y=-r;
                    max.x=b.x;
                    max.y=a.y;
                }
            }
        }else{  // a3 || a4
            if(!f1){
                if(f3&&f4){// a3 b1
                    min.x=-r;
                    min.y=-r;
                    max.x=b.x;
                    max.y=a.y;
                }if((!f3)&&(f4)){// a3 b2
                    min.x=(a.x>b.x)?(b.x):(a.x);
                    min.y=-r;
                    max.x=r;
                    max.y=r;
                }else if((f3)&&(!f4)){// a3 b4
                    min.x=a.x;
                    min.y=-r;
                    max.x=b.x;
                    max.y=(a.y<b.y)?(b.y):(a.y);
                }
            }else{//a4
                if(f3&&f4){// a4 b1
                    min.x=(a.x>b.x)?(b.x):(a.x);
                    min.y=a.y;
                    max.x=r;
                    max.y=b.y;
                }if((!f3)&&(f4)){// a4 b2
                    min.x=b.x;
                    min.y=-r;
                    max.x=r;
                    max.y=r;
                }else if((!f3)&&(!f4)){// a4 b3
                    min.x=-r;
                    min.y=a.y;
                    max.x=r;
                    max.y=r;
                }
            }
        } 
        

        // min.y*=-1;
        // max.y*=-1;

        min.x+=this.c.x;
        max.x+=this.c.x;
        min.y+=this.c.y;
        max.y+=this.c.y;

        return {
            min:min,
            max:max
        };
    }
    /** 一个 刚好包裹 弧形 的 矩形 的 x和y最大的顶点
     * @return {Vector2}
     */
    get_Max(){
        return this.max;
    }
    /** 一个 刚好包裹 弧形 的 矩形 的 x和y最小的顶点
     * @return {Vector2}
     */
    get_Min(){
        return this.min;
    }
    /** 点是否在box内 (使用aabb)
     * @param {Nuimber} x 点的x坐标
     * @param {Nuimber} y 点的y坐标
     * @return 
     */
    is_InBox(x,y){
        return(!((x>this.max.x)||(x<this.min.x)||(y>this.max.y)||(y<this.min.y)));
    }
    /** 点是否在弧形(割圆)内
     * @param {number} x 
     * @param {number} y 
     */
    is_InArc(_x,_y,f){
        var r=this._r;
        var x=_x-this.c.x,
            y=_y-this.c.y;
        var arcA=this.angle;
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(cycles<=arcA){
                return true;//圆形
            }
            else{
                if(f===false){
                    return false;
                }
                // 弧线的两端点
                var l1op=this.opv,  // new Vector2(Math.cos(this.startAngle)*r,Math.sin(this.startAngle)*r),
                    l1ed=this.edv;  // new Vector2(Math.cos(this.endAngle)*r,Math.sin(this.endAngle)*r);
                // 圆心和实参的坐标
                var l2op=new Vector2(0,0);
                var l2ed=new Vector2(x,y);
                var ISF=Math2D.get_intersectionOfLineLine_f(l1op,l1ed,l2op,l2ed);  //相交情况
                if(arcA>Math.PI){
                    // 大于半圆
                    return ISF===0;
                }
                else{
                    if(arcA===Math.PI){
                        // 等于半圆
                        return Math2D.get_VetorInAngle(l1op,l1ed,new Vector2(x,y),arcA>Math.PI);
                    }
                    // 小于半圆
                    return ISF!==0;
                }
            }
        }
        // 不在半径内直接判定为外
        return false;
    }
    /** 点是否在内部
     * @param {number} _x 点的坐标x
     * @param {number} _y 点的坐标y
     * @param {Boolean} f want_to_closePath 当没有成为完整的圆时, 是否需要将其当作一个割圆
     * @return {boolean} 返回 点是否在内部
     */
    is_Inside(x,y,f){
        if(this.is_InBox(x,y)){
            return this.is_InArc(x,y,f);
        }
        return false;
    }
    /** @type {number} 每个点相差的弧度 */
    get polygon_proxy_want_sp(){
        return this._polygon_proxy_want_sp;
    }
    /** @type {number} 每个点相差的弧度 */
    set polygon_proxy_want_sp(val){
        if(val===this._polygon_proxy_want_sp){
            return val;
        }
        this.polygon_proxy=null;
        return this._polygon_proxy_want_sp=val;
    }
    /** @type {{t:number,l:number}[]} 弧长显式查找表 */
    get length_long_lut(){
        var polygon=this.polygon_proxy;
        if(this._length_long_lut[0].l===null){
            var temp;
            this._length_long_lut[0].l=0;
            for(var i=1;i<polygon.nodes.length;++i){
                temp=polygon.nodes[i].dif(polygon.nodes[i-1]).get_Mag();
                this._length_long_lut[i].l=this._length_long_lut[i-1].l+temp;
            }
        }
        return this._length_long_lut;
    }
    /**@type {Polygon} 拟合曲线的多边形 */
    get polygon_proxy(){
        if(this._polygon_proxy===null||this._polygon_proxy_sp!==this.polygon_proxy_want_sp){
            var temp=this.create_PolygonProxy(this.polygon_proxy_want_sp);
            this._polygon_proxy_sp=this.polygon_proxy_want_sp;
            this._polygon_proxy=temp.polygon;
            this._length_long_lut=temp.t_lut;
        }
        return this._polygon_proxy;
    }
    /** 生成拟合弧形的多边形 和 t&length's lut 显式查找表
     */
    create_PolygonProxy(_step_size){
        var rtn,temp=[];
        var startAngle=this.startAngle,
            endAngle=this.endAngle,
            r=this.r,
            step_size=_step_size||this.polygon_proxy_want_sp,
            i=0,tempAngle,
            t_sps=step_size/this.angle,t=0,
            t_lut=[];
        tempAngle=startAngle;
        do{
            temp.push(new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
            t_lut.push({t:t,l:null});
            t+=t_sps;
            tempAngle+=step_size;
        }while(tempAngle<endAngle&&!approximately(1,t));

        temp.push(new Vector2(Math.cos(endAngle)*r,Math.sin(endAngle)*r));
        t_lut.push({t:1,l:null});
        
        rtn=new Polygon(temp);
        rtn.translate(this.c);
                return {
            polygon:rtn,
            t_lut:t_lut
        };
    }
    /** 使用弧长求t值
     * @param {number} length 当前弧长, 为负数时使用终点开始算; 当弧长超出取值范围时取0
     * @return {number} 对应的时间参数t
     */
    get_t_ByLengthLong(length){
        var arcl=this.get_LengthLong();
        var l=length>=0?length:arcl+length;
        return l/arcl;
    }

    /**@type {BezierCurve[]} 代理用的 */
    get bezier_curve_proxy(){
        if(this._bezier_curve_proxy.length){
            return this._bezier_curve_proxy;
        }
        var f=true,bcs=this._bezier_curve_proxy,
            t_op=this.startAngle,
            t_ed=t_op+deg_90,
            true_ed=((true_ed=this.startAngle+cycles)>this.endAngle)?this.endAngle:true_ed,
            k=BEZIER_TO_CYCLES_K__1D4;

        var p1,p2,p3,p4;
        
        while(f){
            if(t_ed>true_ed){
                t_ed=true_ed;
                f=false;
                if((true_ed=t_ed-t_op)<deg_90){
                    k=calc_k__BezierToCyles(true_ed);
                }
            }
            if(approximately(t_op,t_ed)){
                break;
            }
            
            p1=this.sample_ByAngle(t_op);
            p4=this.sample_ByAngle(t_ed);

            t_op+=deg_90;
            t_ed+=deg_90;
            p2=Vector2.sum(p1,this.get_Tangent__ByAngle(t_op).np(+k));
            p3=Vector2.sum(p4,this.get_Tangent__ByAngle(t_ed).np(-k));

                        bcs.unshift(new BezierCurve([p1,p2,p3,p4]));
        }
        

        return bcs;
    }
}

class Data_Arc__Ellipse extends Data_Arc {
    /**
     * @param {number} cx       圆心坐标 x
     * @param {number} cy       圆心坐标 y
     * @param {number} rx       x 方向 半径
     * @param {number} ry       y 方向 半径
     * @param {number} angle_A  未进行变换时的 起点角度
     * @param {number} angle_B  未进行变换时的 终点角度
     * @param {number} rotate   旋转椭圆的弧度
     * @param {Boolean} flip_horizontal_flag 水平翻转
     */
    constructor(cx,cy,rx,ry,angle_A,angle_B,rotate,flip_horizontal_flag){
        super(0,0,rx,angle_A,angle_B);
        /** @type {number} ry, rx d的比 */
        this.ry_ratio_rx=ry/rx;
        /** @type {Matrix2x2T} */
        this._transform_matrix=new Matrix2x2T();
        this._transform_matrix.scale(1,this.ry_ratio_rx);
        if(rotate){
            this._transform_matrix.rotate(rotate);
                    }
        if(flip_horizontal_flag){
            this._transform_matrix.multiplication(Matrix2x2.FLIP_HORIZONTAL);
        }
        this._tc=new Vector2(cx,cy);
        
        /** @type {Matrix2x2T} 变换矩阵 */
        this._transform_matrix.translate(cx,cy);
        /** @type {number} 存储旋转值 */
        this._rotate=rotate||0;
        /** @type {Matrix2x2T} 世界坐标系 to 局部坐标系 变换矩阵, 由transform矩阵的逆运算得到 */
        this._world_to_local_matrix=null;
        /** @type {Boolean} 是否镜像 */
        this._flip_horizontal_flag=flip_horizontal_flag;
    }
    get tc(){
        return this._tc;
    }
    set tc(val){
        this.tc.x=val.x;
        this.tc.y=val.y;
        this.reset_TransformMatrix();
        return this._tc;
    }
    set cx(val){
        this._tc.x=val;
        this.reset_TransformMatrix();
        return val;
    }
    set cy(val){
        this._tc.y=val;
        this.reset_TransformMatrix();
        return val;
    }
    get cy(){return this._tc.y}
    get cx(){return this._tc.x}

    static copy(d){
        return new Data_Arc__Ellipse(
            this.c.x,
            this.c.y,
            this.rx,
            this.ry,
            this._startAngle,
            this._endAngle,
        );
    }
    /** @type {number} 设置基础半径 */
    set basics_r(r){
        this.r=r;
        return r;
    }
    set rx(r){
        this.ry_ratio_rx=this.ry/r;
        this.r=r;
        this.reset_TransformMatrix();
        return r;
    }
    get rx(){
        return this.r;
    }
    set ry(r){
        this.ry_ratio_rx=r/this.rx;
        this.reset_TransformMatrix();
        return r;
    }
    get ry(){
        return this.r*this.ry_ratio_rx;
    }
    set rotate(val){
        this._rotate=val;
        this.reset_TransformMatrix();
        return val;
    }
    get rotate(){
        return this._rotate;
    }
    set flip_horizontal_flag(val){
        this._flip_horizontal_flag=val
        this.reset_TransformMatrix();
        return this._flip_horizontal_flag;
    }
    get flip_horizontal_flag(){
        return this._flip_horizontal_flag;
    }
    get transform_matrix(){
        return this._transform_matrix;
    }
    get world_to_local_matrix(){
        if(!this._world_to_local_matrix){
            this._world_to_local_matrix=this.transform_matrix.create_Inverse();
        }
        return this._world_to_local_matrix;
    }
    reset_TransformMatrix(){
        /** @type {Matrix2x2T} 局部坐标 to 世界坐标 的矩阵 (向量后乘矩阵)*/
        this.transform_matrix.set_Matrix2x2(
            new Matrix2x2T().
            scale(1,this.ry_ratio_rx).
            rotate(this.rotate)
        );
        if(this._flip_horizontal_flag){
            this.transform_matrix.multiplication(Matrix2x2.FLIP_HORIZONTAL);
        }
        this.transform_matrix.translate(this.cx,this.cy);
        this._world_to_local_matrix=null;
    }
    /** 局部 to 世界
     * @param {Vector2} v 局部坐标
     */
    locToWorld(v){
        return Vector2.linearMapping__AfterTranslate(v,this.transform_matrix)
    }
    /** 局部to世界 不使用平移量
     * @param {Vector2} v 
     */
    locToWorld__Untransform(v){
        return Vector2.linearMapping__Base(v,this.transform_matrix);
    }
    /** 世界 to 局部
     * @param {Vector2} v 
     */
    worldToLoc(v){
        var tm=this.world_to_local_matrix;
        return Vector2.linearMapping__BeforeTranslate(v,tm);
    }
    get_Tangent__ByAngle(angle){
        return this.locToWorld__Untransform(super.get_Tangent__ByAngle(angle));
    }
    get_Normal(t){
        var rtn=this.locToWorld__Untransform(super.get_Normal(t)).normalize();
        if(this.flip_horizontal_flag){
            return rtn.np(-1);
        }
        return rtn;
    }
    sample(t){
        return this.sample__ByLengthLong(t);
    }
    sample__ByLengthLong(t){
        return this.locToWorld(
            super.sample(this.get_t_ByLengthLong(t*this.get_LengthLong()))
        );
    }
    sample__ByTime(t){
        return this.locToWorld(
            super.sample(t)
        );
    }
    sample_ByAngle(angle){
        return this.locToWorld(super.sample_ByAngle(angle));
    }
    get_Opv__World(){
        return this.locToWorld(super.get_Opv());
    }
    get_Edv__World(){
        return this.locToWorld(super.get_Edv());
    }
    create_PolygonProxy(step_size){
        var temp=super.create_PolygonProxy(step_size);
        temp.polygon.linearMapping(this.transform_matrix,true,false);
        return temp
    }
    /** 求弧长
     * @param {number} step_size 弧度采样精度 在变换前的采样点间的弧度差异
     * @return {number} 使用多边形拟合曲线求得的长度
     */
    get_LengthLong(step_size){
        if(step_size) this.polygon_proxy_want_sp=step_size;
        return this.polygon_proxy.get_LengthLong();
    }
    /** 使用弧长求t值
     * @param {number} length 当前弧长, 为负数时使用终点开始算; 当弧长超出取值范围时取0
     * @param {number} step_size t 时间参数的采样步长, 设置越接近0精度越高; 默认为 0.1 或者保留原有的
     * @return {number} 对应的时间参数t
     */
    get_t_ByLengthLong(length,step_size){
        if(step_size) this.polygon_proxy_want_sp=step_size;
        var tb=this.length_long_lut,
            i=tb.length-1,
            l=length>=0?length:tb[i].l+length;
        for(--i;i>=0;--i){
            if(tb[i].l<l){
                // return this._polygon_proxy_sp*(i+(l-tb[i])/(tb[i+1]-tb[i]))

                if(tb[i+1]){
                    return tb[i].t+(l-tb[i].l)/(tb[i+1].l-tb[i].l)*(tb[i+1].t-tb[i].t);
                }
                return 0;
            }
        }
        return 0;
    }
    is_Inside(x,y,f){
        var tempv=this.worldToLoc({x:x,y:y});
                        return super.is_Inside(tempv.x,tempv.y,f);
    }
    get_MinAmax(){
        var temp=this.bezier_curve_proxy,
            i=temp.length-1,
            min,t_min,
            max,t_max,
        min=temp[i].get_Min();
        max=temp[i].get_Max();
        
        for(--i;i>=0;--i){
            t_min=temp[i].get_Min();
            t_max=temp[i].get_Max();

            if(t_min.x<min.x)min.x=t_min.x;
            if(t_min.y<min.y)min.y=t_min.y;

            if(t_max.x>max.x)max.x=t_max.x;
            if(t_max.y>max.y)max.y=t_max.y;
        }
        return {
            min:min,
            max:max
        };
    }

    /** 别乱用! 这个是给 create_byEndPointRadiusRotate 用的!
     * 使用起点, 终点, 半径 等参数创建弧形 
     * @param {Vector2} op                 起点
     * @param {Vector2} ed                 终点
     * @param {number}  rx                 水平方向半径
     * @param {number}  ry                 垂直方向半径
     * @param {Boolean} rotate_angle       旋转弧度(用圆心进行旋转) 
     * @param {Boolean} large_arc_flag     使用更长或更短的边   和 sweep_flag 联动来确定弧线
     * @param {Boolean} sweep_flag         弧形绘制方向        和 large_arc_flag 联动来确定弧线
     * @return {Data_Arc__Ellipse}
     * 除了起点和终点, 参数可以参考 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#arcs
     */
    static create_ByEndPointRadiusRotate__UnRotate(op,ed,rx,ry,large_arc_flag,sweep_flag){
        var arc=new Data_Arc__Ellipse(0,0,rx,ry,0,0),
            d_ed=Vector2.dif(ed,op),
            _ed=arc.worldToLoc(d_ed),
            wi=Math2D.get_intersectionOfCircleCircle_V(Vector2.ZERO_POINT,rx,_ed,rx),
            cf=(large_arc_flag===sweep_flag),
            i=cf?1:0,
            loc_c,
            temp,
            c_op,c_ed,
            op_a,ed_a;
           
        loc_c=arc.locToWorld(wi[i]||_ed.np(0.5));
        if(!wi.length){
            var temp_cw=loc_c.copy();
            temp_cw.y/=arc.ry_ratio_rx;
            arc.r=temp_cw.get_Mag();
        }
        
        var c=Vector2.sum(op,loc_c);
        arc.tc=c;
        console.log(arc.tc)

        c_op=arc.worldToLoc(op);
        c_ed=arc.worldToLoc(ed);
        op_a=Math.atan2(c_op.y,c_op.x)+2*Math.PI;
        ed_a=Math.atan2(c_ed.y,c_ed.x)+2*Math.PI;

        if((!!large_arc_flag)===(Math.abs(op_a-ed_a)<180*deg)){
            temp=Math2D.toLargeArc(op_a,ed_a);
            op_a=temp[0];
            ed_a=temp[1];
        }
        if(op_a>ed_a){
            arc.flip_horizontal_flag=true;
            op_a=Math2D.angleFlipHorizontal(op_a);
            ed_a=Math2D.angleFlipHorizontal(ed_a);
        }
        
        arc.setAngle_AB(
            op_a,
            ed_a,
        );
        
        return arc;
    }

    /** 使用起点, 终点, 半径 等参数创建弧形
     * @param {Vector2} op                 起点
     * @param {Vector2} ed                 终点
     * @param {number}  rx                 水平方向半径
     * @param {number}  ry                 垂直方向半径
     * @param {Boolean} rotate_angle       旋转弧度(用圆心进行旋转)
     * @param {Boolean} large_arc_flag     使用更长或更短的边   和 sweep_flag 联动来确定弧线
     * @param {Boolean} sweep_flag         弧形绘制方向        和 large_arc_flag 联动来确定弧线
     * @return {Data_Arc__Ellipse}
     * 除了起点和终点, 参数可以参考 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#arcs
     */
    static create_ByEndPointRadiusRotate(op,ed,rx,ry,rotate_angle,large_arc_flag,sweep_flag){
        var _rotate_angle=rotate_angle,
            rotate_Matrix=Matrix2x2.create.rotate(-_rotate_angle),
            rotate_Matrix_i=Matrix2x2.create.rotate(_rotate_angle),
            _op=Vector2.copy(op).linearMapping(rotate_Matrix),
            _ed=Vector2.copy(ed).linearMapping(rotate_Matrix);
        var arc=Data_Arc__Ellipse.create_ByEndPointRadiusRotate__UnRotate(_op,_ed,rx,ry,large_arc_flag,sweep_flag),
            c=new Vector2(arc.cx,arc.cy).linearMapping(rotate_Matrix_i);
        arc.cx=c.x;
        arc.cy=c.y;
        arc.rotate=sweep_flag?-_rotate_angle:_rotate_angle;
        return arc;
    }
}

// 扇形------------------------------------

/** 扇形的数据
 */
class Data_Sector extends Data_Arc{
     /** 旋转方向默认是顺时针, 并且 起点弧度 始终 会 小于 终点弧度
      * @param {number} cx 圆心坐标
      * @param {number} cy 圆心坐标
      * @param {number} r  半径
      * @param {number} angle_A     弧形端点弧度
      * @param {number} angle_B     弧形端点弧度
      */
    constructor(cx,cy,r,angle_A,angle_B){
        super(cx,cy,r,angle_A,angle_B);
    }
    create_PolygonProxy(_accuracy){
        var rtn=Polygon.sector(this.r,this.startAngle,this.endAngle,_accuracy);
        rtn.translate(this.c);
        return rtn;
    }
    is_Inside(_x,_y){
        if((_x>this.max.x)||(_x<this.min.x)||(_y>this.max.y)||(_y<this.min.y)){
            return false;
        }
        var r=this._r;
        var x=_x-this.c.x,
            y=_y-this.c.y;
        var arcA=this.angle;
        var tr=Math.sqrt(x*x+y*y);
        if(tr<=r){
            // 在半径内
            if(cycles<=arcA){
                return true;//圆形
            }
            else{
                return Math2D.get_VetorInAngle(this.opv,this.edv,new Vector2(x,y),arcA>Math.PI);
            }
        }
        // 不在半径内直接判定为外
        return false;
    }
    get_MinAmax(){
        var d=super.get_MinAmax();
        var c=this.c;
        if(d.min.x>c.x){
            d.min.x=c.x;
        }
        if(d.min.y>c.y){
            d.min.y=c.y;
        }
        if(d.max.x<c.x){
            d.max.x=c.x;
        }
        if(d.max.y<c.y){
            d.max.y=c.y;
        }
        return d;
    }
}

/* 向量------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/** 
 * @class 2维向量
 * @param {number}  x 
 * @param {number}  y 
 */
 class Vector2{
    /** 
     * @param {number}  x
     * @param {number}  y
     */
    constructor(x,y){
        this.x=x||0;
        this.y=y||0;
    }
    static copy(tgt){
        return tgt===undefined?new Vector2():new Vector2(tgt.x,tgt.y);
    }
    /**拷贝向量
     * @return {Vector2} 
     */
    copy(){
        return new Vector2(this.x,this.y);
    }
    /** 归零 */
    re_Zero(){
        this.x=this.y=0;
    }
    /** 向量在哪个象限上, 规定 0 视作正
     */
    get_Quadrant(){
        var f1=this.x>=0,f2=this.y>=0;
        if(f1){
            if(f2){
                return 1;
            }else{
                return 4;
            }
        }else{
            if(f2){
                return 2;
            }else{
                return 3;
            }
        }
    }
    /** 使用x坐标和y坐标的数组创建向量
     * @param {number[]} x_arr x坐标的集合
     * @param {number[]} y_arr y坐标的集合
     * @return {Vector2[]} 返回坐标向量集合
     */
    static create_ByArray(x_arr,y_arr){
        var rtn=new Array(x_arr.length);
        for(var i = x_arr.length-1;i>=0;--i){
            rtn[i]=new Vector2(x_arr[i],y_arr[i]);
        }
        return rtn
    }
    /**求模
     * @return {number} 
	 */
	get_Mag() {
		return Math.sqrt(this.x*this.x+this.y*this.y);
    }
	/**标准化向量
     * @return {Vector2} this
	 */
	normalize() {
        if(this.x==0&&this.y==0)return;
		var magSq = this.get_Mag(),oneOverMag=0;
		if (magSq>0) {
			oneOverMag = 1.0/magSq;
			this.x *= oneOverMag;
			this.y *= oneOverMag;
		}
        return this;
    }
	/**生成标准化向量
     * @return {Vector2} 新向量
	 */
	create_Normalization() {
        var rtn=this.copy();
        rtn.normalize
        return rtn;
    }
    /**判断向量是不是零向量
     * @return {boolean}
     */
    is_Zero(){return !(this.x||this.y);}
    /**取反
     * @return{Vector2} 返回新的向量
     */
    instead(){return new Vector2(-1*this.x,-1*this.y);}
    /**向量和
     * @param {Vector2} v2
     * @return {Vector2} 返回新的向量
     */
    sum(v2){return new Vector2(this.x+v2.x,this.y+v2.y);}
    /** 再平移
     * @param {Vector2} v2  偏移量向量
     * @return {Vector2} 返回当前
     */
    translate(v2){
        this.x+=v2.x;
        this.y+=v2.y;
        return this;
    }
    /**数字乘向量 
     * @param {number} n
     * @return {Vector2} 返回新的向量
     */
    np(n){return new Vector2(this.x*n,this.y*n);}
    /**向量差
     * @param {Vector2} v2 减
     * @return{Vector2} 返回新的向量
     */
    dif(v2){return new Vector2(this.x-v2.x,this.y-v2.y);}
    /** 向量内积
     * @param {Vector2} v2
     * @return{number} 
     */
    dot(v2){return this.x*v2.x+this.y*v2.y;}
    /**向量外积
     * @param {Vector2} v2 
     * @return{number} 
     */
    cross(v2){return this.x*v2.y-this.y*v2.x;}
    /** 进行线性变换
     * @param {Matrix2x2T}  m   变换矩阵
     * @param {Boolean}     fln 向量前乘还是前后乘矩阵  默认是前乘 (默认为false) 
     * @param {Boolean}     f   先平移还是先变换 默认先变换再平移 (默认为false) 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心
     * @return {Vector2} 返回this
     */ 
    linearMapping(m,fln=false,f=false,anchorPoint){
        if(anchorPoint){
            this.x-=anchorPoint.x||0;
            this.y-=anchorPoint.y||0;
        }

        if(f){
            if(m.e){
                this.x+=m.e;
            }
            if(m.f){
                this.y+=m.f;
            }
        }
        var tempx=this.x;
        var tempy=this.y;
        if(fln){   
            this.x=tempx*m.a+tempy*m.c;
            this.y=tempx*m.b+tempy*m.d;
        }else{
            this.x=tempx*m.a+tempy*m.b;
            this.y=tempx*m.c+tempy*m.d;
        }
        if(!f){
            if(m.e){
                this.x+=m.e;
            }
            if(m.f){
                this.y+=m.f;
            }
        }
        if(anchorPoint){
            this.x+=anchorPoint.x||0;
            this.y+=anchorPoint.y||0;
        }
        return this;
    }

    /**向量和
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return{Vector2}
     */
     static sum(v1,v2){return new Vector2(v1.x+v2.x,v1.y+v2.y);}
    /**向量差1-2
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return{Vector2}
     */
    static dif(v1,v2){return new Vector2(v1.x-v2.x,v1.y-v2.y);}
    
    /** 向量内积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return{number}
     */
    static dot(v1,v2){return v1.x*v2.x+v1.y*v2.y;}
    /**向量外积
     * @param {Vector2} v1
     * @param {Vector2} v2
     * @return{number}
     */
    static cross(v1,v2){return v1.x*v2.y-v1.y*v2.x;}
    
    /**数字乘向量 
     * @param {Vector2} v
     * @param {number} n
     * @return {Vector2} 返回新的向量
    */
    static np(v,n){return new Vector2(v.x*n,v.y*n);}
    /** 线性变换(矩阵和向量的乘法), 根据实参的顺序重载后乘对象
     * (v,m)行向量后乘矩阵
     * (m,v)矩阵后乘列向量
     * @param {Vector2} v 向量
     * @param {Matrix2x2} m 矩阵
     * @return {Vector2} 返回一个向量
     */
    static linearMapping__Base(v,m){
    }
    /** 先进行2x2变换 再平移
     * @param {Vector2} v 
     * @param {Matrix2x2T} m 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心
     * @return {Vector2} 返回一个向量
     */
    static linearMapping__AfterTranslate(v,m,anchorPoint){
        var tv,tm;
        if(v.a===undefined){
            tv=Vector2.copy(v);
            tm=m;
        }else{
            tv=Vector2.copy(m);
            tm=v;
        }
        if(anchorPoint){
            tv.x-=anchorPoint.x;
            tv.y-=anchorPoint.y;
        }

        var rtnv;
        
        if(v.a===undefined){
            rtnv=Vector2.linearMapping__Base(tv,tm);
        }else{
            rtnv=Vector2.linearMapping__Base(tm,tv);
        }
        rtnv.x+=tm.e;
        rtnv.y+=tm.f;
        if(anchorPoint){
            rtn.translate(anchorPoint)
        }
        return rtnv;
    }
    /** 先平移 再 进行2x2变换, 根据实参的顺序重载后乘对象
     * @param {Vector2} v 
     * @param {Matrix2x2T} m 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心
     * @return {Vector2} 返回一个向量
     */
    static linearMapping__BeforeTranslate(v,m,anchorPoint){
        var tv,tm,rtn;
        if(v.a===undefined){
            tv=Vector2.copy(arguments[0]);
            tm=arguments[1];
            if(anchorPoint){
                tv.x-=anchorPoint.x;
                tv.y-=anchorPoint.y;
            }
            if(tm.constructor==Matrix2x2T){
                tv.x+=tm.e;
                tv.y+=tm.f;
            }
            rtn=Vector2.linearMapping__Base(tv,tm);
        }
        else{
            tm=arguments[0];
            tv=Vector2.copy(arguments[1]);
            if(anchorPoint){
                tv.x-=anchorPoint.x;
                tv.y-=anchorPoint.y;
            }
            if(tm.constructor==Matrix2x2T){
                tv.x+=tm.e;
                tv.y+=tm.f;
            }
            rtn=Vector2.linearMapping__Base(tm,tv);
        }
        if(anchorPoint){
            rtn.translate(anchorPoint)
        }
        return rtn;
    }
    /** 线性变换(矩阵和向量的乘法), 根据实参的顺序重载后乘对象
     * (v,m)行向量后乘矩阵
     * (m,v)矩阵后乘列向量
     * @param {Vector2} v 向量
     * @param {Matrix2x2} m 矩阵
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心
     * @return {Vector2} 返回一个向量
     */
    static linearMapping(v,m,translate_befroeOrAfter=false,anchorPoint){
        if(translate_befroeOrAfter){
            return Vector2.linearMapping__BeforeTranslate(v,m,anchorPoint);
        }else{
            return Vector2.linearMapping__AfterTranslate(v,m,anchorPoint);
        }
    }
    /** 判断向量是否相等
     */
    static is_Equal(v1,v2){
        return (v1.x==v2.x&&v1.y==v2.y);
    }
    /** 求模长 */
    static get_Mag(v){
        return Math.sqrt(v.x*v.x+v.y*v.y);
    }
    /** 向量夹角运算
     * @param {Vector2} v1 表示角的一边的射线上 的 向量
     * @param {Vector2} v2 表示角的一边的射线上 的 向量
     * @return {number} 返回夹角的cos值
     */
    static cos_VV(v1,v2){
        return Vector2.dot(v1,v2)/(Vector2.get_Mag(v1)*Vector2.get_Mag(v2));
    }
}
Vector2.ZERO_POINT=new Vector2(0,0);
Vector2.INFINITY=new Vector2(Infinity,Infinity);


/* 矩阵 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/** 2*2矩阵
 * @param {number} a  矩阵的参数 m11
 * @param {number} b  矩阵的参数 m12
 * @param {number} c  矩阵的参数 m21
 * @param {number} d  矩阵的参数 m22
 */
 class Matrix2x2{
    constructor(a,b,c,d){
        /** @type {numbner[]} 使用一维数组存储数据 */
        this._data=[];
        this.a= a===undefined ? 1 : a;
        this.b= b===undefined ? 0 : b;
        this.c= c===undefined ? 0 : c;
        this.d= d===undefined ? 1 : d;
    }
    get a(){return this._data[0];} set a(val){return this._data[0]=val;}
    get b(){return this._data[1];} set b(val){return this._data[1]=val;}
    get c(){return this._data[2];} set c(val){return this._data[2]=val;}
    get d(){return this._data[3];} set d(val){return this._data[3]=val;}
    /** 将矩阵的数字转换成字符串
     * @param {string} sp_str 
     * @return 
     */
    join(sp_str){
        return  ""+this.a+sp_str+
                this.b+sp_str+
                this.c+sp_str+
                this.d;
    }
    /**设置当前矩阵的值
     * @param {Matrix2x2} m 数据来源矩阵
     * @return {Matrix2x2} 返回当前矩阵
     */
    set_Matrix2x2(m){
        this.a=m.a===undefined?this.a:m.a;
        this.b=m.b===undefined?this.b:m.b;
        this.c=m.c===undefined?this.c:m.c;
        this.d=m.d===undefined?this.d:m.d;

        return this;
    }
    static copy(m){
        return new Matrix2x2(m.a,m.b,m.c,m.d);
    }
    copy(){
        return new Matrix2x2(this.a,this.b,this.c,this.d);
    }
    /** 当前矩阵后乘一个矩阵
     * @param {Matrix2x2} m 右(后)矩阵
     * @return {Matrix2x2} 返回当前矩阵
     */
    multiplication(m){
        var 
        a=this.a*m.a+this.b*m.c,
        b=this.a*m.b+this.b*m.d,
        c=this.c*m.a+this.d*m.c,
        d=this.c*m.b+this.d*m.d;
        this.a=a;
        this.b=b;
        this.c=c;
        this.d=d;
        return this;
    }
    /** 当前矩阵前乘一个矩阵
     * @param {Matrix2x2} m 右(后)矩阵
     * @return {Matrix2x2} 返回当前矩阵
     */
    multiplication_Before(m){
        var 
        a=m.a*this.a+m.b*this.c,
        b=m.a*this.b+m.b*this.d,
        c=m.c*this.a+m.d*this.c,
        d=m.c*this.b+m.d*this.d;
        this.a=a;
        this.b=b;
        this.c=c;
        this.d=d;
        return this;
    }
    /** 当前矩阵后乘一个矩阵
     * @param {Matrix2x2} m 右(后)矩阵
     * @return {Matrix2x2} 新的矩阵
     */
    create_ByMultiplication(m){
        var rtn=this.copy();
        rtn.a=this.a*m.a+this.b*m.c;
        rtn.b=this.a*m.b+this.b*m.d;
        rtn.c=this.c*m.a+this.d*m.c;
        rtn.d=this.c*m.b+this.d*m.d;
        return rtn;
    }
    /** 转置矩阵
     */
    create_Transposed(){
        var rtn=this.copy();
        rtn.b=this.c;
        rtn.c=this.b;
        return rtn;
    }
    /** 矩阵的行列式
     * @return{number} 行列式
     */
    get_Det(){
        return this.a*this.d-this.b*this.c;
    }
    /** 矩阵的逆
     * @return {Matrix2x2} 返回一个矩阵
     * @throws {Matrix2x2} 矩阵为奇异矩阵时，返回一个单位矩阵
     */
    create_Inverse(){
        var m=this,
            det=this.get_Det(m);
        // assert(det<0.00001);
        if(det==0){
            console.error("this is a singular matrix !");
            // 这是个奇异矩阵，所以没有逆; 返回一个单位矩阵
            return new Matrix2x2();
        }
        var oneOverDet=1/det,
            rtn=new Matrix2x2();
        rtn.a=  m.d*oneOverDet;
        rtn.b= -m.b*oneOverDet;
        rtn.c= -m.c*oneOverDet;
        rtn.d=  m.a*oneOverDet;
        return rtn;
    }
    /** 缩放
     * @param {number} x x 轴方向上的缩放系数
     * @param {number} y y 轴方向上的缩放系数
     */
    scale(x,y){
        return this.multiplication(
            Matrix2x2.create.scale(x,y)
        );
    }
    /** 旋转
     * @param {number} theta 顺时针 旋转角弧度
     */
    rotate(theta){
        return this.multiplication(
            Matrix2x2.create.rotate(theta)
        );
    }
    /** 切变
     * @param {number} axis 方向轴 0:x 非零:y
     * @param {number} k 切变系数
     */
    shear(axis,k){
        return this.multiplication(
            Matrix2x2.create.shear(axis,k)
        );
    }
    /** 镜像(对称)
     * @param {number} x 对称轴的法向 x 坐标
     * @param {number} y 对称轴的法向 y 坐标
     */
    horizontal(x,y){
        return this.multiplication(
            Matrix2x2.create.horizontal(x,y)
        );
    }
    /** 根据向量生成 等比缩放&旋转 矩阵
     * @param {Vector2} v 
     */
    static create_ByVector2(v){
        return new this(v.x,v.y,-1*v.y,v.x);
    }
    /** 将矩阵标准化(回归初始状态)
     */
    normalize(){
        this.a=1;
        this.b=0;
        this.c=0;
        this.d=1;
        return this;
    }
    /** 计算行列式
     * @param {number[]} data 一维数组存储的2x2矩阵数据
     * @return {number} 2d矩阵的行列式
     */
    static calc_Det(data){
        return data[0]*data[3]-data[1]*data[2];
    }
    
    /** 计算行列式
     * @param {number} d0 矩阵数据 m11
     * @param {number} d1 矩阵数据 m21
     * @param {number} d2 矩阵数据 m12
     * @param {number} d3 矩阵数据 m22
     * @return {number}
     */
    static calc_Det__arg(d0,d1,d2,d3){
        return d0*d3-d1*d2;
    }
}

/** 创建矩阵
 */
Matrix2x2.create={
    /** 旋转
     * @param {number} theta 顺时针 旋转角弧度
     * @return {Matrix2x2}
     */
    rotate:function(theta){
        var s=Math.sin(theta),
            c=Math.cos(theta);
        return new Matrix2x2(c,s,-s,c);
    },
    /** 缩放
     * @param {number} x x 轴方向上的缩放系数
     * @param {number} y y 轴方向上的缩放系数
     * @return {Matrix2x2}
     */
    scale:function(x,y){
        return new Matrix2x2(x,0,0,y);
    },
    /** 镜像(对称)
     * @param {number} x 对称轴的法向 x 坐标
     * @param {number} y 对称轴的法向 y 坐标
     * @return {Matrix2x2}
     */
    horizontal:function (x,y){
        return new Matrix2x2(
            1-2*x*x ,   -2*x*y,
            -2*x*y  ,   1-2*y*y
        )
    },
    /** 切变
     * @param {number} axis 方向轴 0:x 非零:y
     * @param {number} k 切变系数
     * @return {Matrix2x2}
     */
    shear:function(axis,k){
        if(axis){
            // y轴
            return new Matrix2x2(1,0,k,1);
        }
        else{
            // x轴
            return new Matrix2x2(1,k,0,1);
        }
    },
    /** 单位矩阵
     * @return {Matrix2x2}
     */
    identity:function(){
        return new Matrix2x2(1,0,0,1);
    },
    /** 使用向量方向设置旋转矩阵
     * @param {Vector2} _v 向量
     * @return {Matrix2x2}
     */
    rotate_v(_v){
        var v=Vector2.copy(_v).normalize();
        return new Matrix2x2(v.x,v.y,-v.y,v.x)
    }
}
Matrix2x2.ROTATE_90=new Matrix2x2(0,1,-1,0);
Matrix2x2.ROTATE_90_I=new Matrix2x2(0,-1,1,0);
Matrix2x2.FLIP_HORIZONTAL=new Matrix2x2(-1,0,0,1)
/** 2*2矩阵 + 平移
 * @param {number} a  矩阵的参数 m11
 * @param {number} b  矩阵的参数 m12
 * @param {number} c  矩阵的参数 m21
 * @param {number} d  矩阵的参数 m22
 * @param {number} e  平移量x
 * @param {number} f  平移量y
 */
class Matrix2x2T extends Matrix2x2{
    constructor(a,b,c,d,e,f){
        super(a,b,c,d);
        this.e=e||0;
        this.f=f||0;
    }
    get e(){return this._data[4];} set e(val){return this._data[4]=val;}
    get f(){return this._data[5];} set f(val){return this._data[5]=val;}
    join(sp_str){
        this._data.join(sp_str);
    }
    normalize(){
        super.normalize();
        this.e=0;
        this.f=0;
        return this;
    }
    static copy(m){
        if(m===undefined)return;
        return new Matrix2x2T(m.a,m.b,m.c,m.d,m.e,m.f);
    }
    copy(){
        return new Matrix2x2T(this.a,this.b,this.c,this.d,this.e,this.f);
    }
    /**设置当前矩阵的值
     * @param {Matrix2x2T} m 数据来源矩阵
     * @return {Matrix2x2T} 返回当前矩阵
     */
    set_Matrix2x2(m){
        this.a=m.a===undefined?this.a:m.a;
        this.b=m.b===undefined?this.b:m.b;
        this.c=m.c===undefined?this.c:m.c;
        this.d=m.d===undefined?this.d:m.d;
        this.e=m.e===undefined?this.e:m.e;
        this.f=m.f===undefined?this.f:m.f;
        return this;
    }
    create_Inverse(){
        var temp=super.create_Inverse();
        if(temp){
            temp=Matrix2x2T.prototype.copy.call(temp);
            temp.e=-1*this.e;
            temp.f=-1*this.f;
            return temp;
        }
        else{
            // 这个矩阵没有逆
            return;
        }
    }
    /**当前矩阵后乘矩阵m
     * @param {Matrix2x2} m 后矩阵
     * @return {Matrix2x2T} 返回当前
     */
    multiplication(m){
        super.multiplication(m);
        var e=this.e*m.a+this.f*m.c,
            f=this.e*m.b+this.f*m.d;
        this.e=e;
        this.f=f;
        if(!(m.e===undefined)){
            this.e+=m.e;
            this.f+=m.f;
        }
        return this;
    }
    /** 当前矩阵前乘一个矩阵
     * @param {Matrix2x2} m 右(后)矩阵
     * @return {Matrix2x2} 返回当前矩阵
     */
    multiplication_Before(m){
        super.multiplication_Before(m);
        if(!(m.e===undefined)){
            var e=m.e*this.a+m.f*this.c,
                f=m.e*this.b+m.f*this.d;
            this.e+=e;
            this.f+=f;
        }
        return this;
    }
    create_ByMultiplication(m){
        var rtn=this.copy();
        return rtn.multiplication(m);
    }
    /** 设置 translate 值
     * @param {number} x 
     * @param {number} y 
     */
    set_Translate(x,y){
        this.e=x;
        this.f=y;
        return this;
    }
    /** 再平移
     * @param {number} x x轴偏移量
     * @param {number} y y轴偏移量
     */
    translate(x,y){
        this.e+=x;
        this.f+=y;
        return this;
    }
    /** 将线段作为局部坐标系x轴正方向单位生成矩阵
     * @param {Vector2} v1 线段的起点
     * @param {Vector2} v2 线段的终点
     */
    static create_ByLine(v1,v2){
        var v3={x:v2.x-v1.x,y:v2.y-v1.y};
        return new Matrix2x2T(v3.x,v3.y,-1*v3.y,v3.x,v1.x,v1.y);
    }
}

/** 矩阵转换成css的样子
 * @param {Matrix2x2T} m 
 * @return {string}
 */
 function matrixToCSS(m){
    return "matrix("+
    [
        m.a,
        m.b,
        m.c,
        m.d,
        m.e||0,
        m.f||0,
    ].join(',')
    +")"
}

class MatrixController__base{
    /** 转换成最终使用的矩阵
     * @virtual
     */
    toMatrix(){}
    /** 转换成字符串,语法 与 css 中的 transform 属性的值相似
     * @virtual
     */
    toMatrix(){}
    /** 转换成矩阵的控制器 
     */
    toMatrixController(){
        return new MatrixController__matrix(this.toMatrix());
    }
}

/** 复合型 */
class MatrixController extends MatrixController__base{
    constructor(){
        super();
        /** @type {MatrixController__base} 子控制*/
        this.controllers=[];
        this.i=new Iterator__Tree(this,"controllers");
    }
    toMatrix(){
        var i=this.i;
        var rtn=new Matrix2x2T();
        for(i.init();i.is_NotEnd();i.next()){
            rtn.multiplication(i.get_Now().toMatrix());
        }
        return rtn;
    }
    toString(){
        var i=this.i;
        var rtn=[];
        for(i.init();i.is_NotEnd();i.next()){
            rtn.push(i.get_Now().toString());
        }
        return rtn.join(" ");
    }
}

/** 矩阵 */
class MatrixController__matrix extends MatrixController__base{
    /**
     * @param {number} a 矩阵计算参数 m11   重载  使用矩阵
     * @param {number} b 矩阵计算参数 m12
     * @param {number} c 矩阵计算参数 m21
     * @param {number} d 矩阵计算参数 m22
     * @param {number} e 齐次坐标 平移量
     * @param {number} f 齐次坐标 平移量
     */
    constructor(a,b,c,d,e,f){
        this.type="matrix";
        if(a instanceof Matrix2x2){
            this.matrix=a;
        }
        else{
            this.matrix=new Matrix2x2T(a,b,c,d,e,f);
        }
    }
    toMatrix(){
        return this.matrix.copy();
    }
    toString(){
        return matrixToCSS(this.matrix);
    }
}
/** 旋转 */
 class MatrixController__rotate extends MatrixController__base{
    /**
     * @param {number} rotate 旋转弧度
     */
    constructor(rotate){
        this.type="rotate";
        this.rotate=rotate;
    }
    toMatrix(){
        return new Matrix2x2T().rotate(this.rotate);
    }
    toString(){
        return "rotate("+this.rotate+")";
    }
}
/** 平移 */
 class MatrixController__translate extends MatrixController__base{
    /**
     * @param {number} x x坐标平移量
     * @param {number} y y坐标平移量
     */
    constructor(x,y){
        this.type="translate";
        this.x=x;
        this.y=y;
    }
    toMatrix(){
        return new Matrix2x2T().set_Translate(this.x,this.y);
    }
    toString(){
        return "translate("+this.x+','+this.y+")";
    }
}
/** 镜像 */
 class MatrixController__horizontal extends MatrixController__base{
    /**
     * @param {number} x 对称轴的法向坐标
     * @param {number} y 对称轴的法向坐标
     */
    constructor(x,y){
        this.type="horizontal";
        this.x=x;
        this.y=y;
    }
    toMatrix(){
        return new Matrix2x2T().horizontal(this.x,this.y);
    }
    toString(){
        return "horizontal("+this.x+','+this.y+")";
    }
}
/** 切变 */
 class MatrixController__shear extends MatrixController__base{
    /**
     * @param {number} axis 方向轴 0:x 非零:y
     * @param {number} k 切变系数
     */
    constructor(axis,k){
        this.type="shear";
        this.axis=axis;
        this.k=k;
    }
    toMatrix(){
        return new Matrix2x2T().shear(this.axis,this.k);
    }
    toString(){
        return "shear("+this.axis+','+this.k+")";
    }
}
/** 缩放 */
class MatrixController__scale extends MatrixController__base{
    /** 
     * @param {number} x x方向的缩放系数
     * @param {number} y y方向的缩放系数
     */
    constructor(x,y){
        super();
        this.type="scale";
        this.x=x;
        this.y=y;
    }
    
    toMatrix(){
        return new Matrix2x2T().scale(this.x,this.y);
    }
    toString(){
        return "shear("+this.axis+','+this.k+")";
    }
}

/** 多边形  */
class Polygon{
    /** 多边形
     * @param {Vector2[]} nodes 装着顶点的数组
     */
    constructor(nodes){
        /** @type {Vector2[]}  存放 向量 的列表  */
        this.nodes=[];
        /** @type {Vectro2} 能正好包住多边形的矩形的x和y最小的顶点 */
        this.min    =new Vector2();
        /** @type {Vectro2} 能正好包住多边形的矩形的x和y最大的顶点 */
        this.max    =new Vector2();

        if(nodes&&nodes.constructor==Array){
            this.add_Nodes(nodes);
        }
        /**@type {number[]} 边线长度lut表 */
        this._length_long_lut=[];
        /**@type {number} 所有边线总长度 为负数时说明是未计算状态*/
        this._all_lines_length=-1;
        /**@type {Delegate} 顶点插入或删除后的委托  */
        this.after_nodes_move_Delegate=Delegate.create();
        /**@type {Delegate} 顶点修改后的委托  */
        this.after_node_change_Delegate=Delegate.create();
    }
    static copy(polygon){
        var ret=new Polygon();
        if(polygon&&polygon.nodes){
            ret.nodes=[];
            ret.min=Vector2.prototype.copy.call(polygon.min);
            ret.max=Vector2.prototype.copy.call(polygon.max);
            var l=polygon.nodes.length,i=0;
            for(;i<l;++i){
                ret.add_Node(polygon.nodes[i]);
            }
        }

        return ret;
    }
    copy(){
        return Polygon.copy(this);
    }
    /** 刷新 最大xy 最小xy
     */
    refresh_MinMax(){
        if(!this.nodes.length)return;
        this.max.x=this.nodes[0].x;
        this.max.y=this.nodes[0].y;
        this.min.x=this.nodes[0].x;
        this.min.y=this.nodes[0].y;
        for(var i=this.nodes.length-1;i>=0;--i){
                 if(this.nodes[i].x>this.max.x)this.max.x=this.nodes[i].x;
            else if(this.nodes[i].x<this.min.x)this.min.x=this.nodes[i].x;
                 if(this.nodes[i].y>this.max.y)this.max.y=this.nodes[i].y;
            else if(this.nodes[i].y<this.min.y)this.min.y=this.nodes[i].y;
        }
    }
    /**追加顶点
     * @param {Vector2} v       要追加的顶点
     */
    add_Node(v){
        this.nodes.push(Vector2.prototype.copy.call(v));
        if(this.nodes.length>1){
            if(v.x>this.max.x){
                this.max.x=v.x;
            }
            else if(v.x<this.min.x){
                this.min.x=v.x;
            }
            if(v.y>this.max.y){
                this.max.y=v.y;
            }
            else if(v.y<this.min.y){
                this.min.y=v.y;
            }
        }
        else{
            this.refresh_MinMax();
        }
    }
    /** 加入一组顶点数组
     * @param {Array <Vector2>} nodes 装着顶点的数组
     */
    add_Nodes(nodes){
        for(var i=0;i<nodes.length;++i){
            this.add_Node(nodes[i]);
        }
    }
    /** 插入顶点
     * @param {number} index    要插入的顶点的下标
     * @param {Vector2} v       要插入的顶点
     */
    insert_Node(index,v){
        this.nodes.splice(index,0,v);
        if(this.nodes.length>1){
                 if(v.x>this.max.x)this.max.x=v.x;
            else if(v.y<this.min.x)this.min.x=v.x;
                 if(v.y>this.max.y)this.max.y=v.y;
            else if(v.y<this.min.y)this.min.y=v.y;
        }else{
            this.refresh_MinMax();
        }
        this.after_nodes_Move(index,true);
    }
    /** 移除顶点
     * @param {number} index 要删除的顶点的下标
     */
    remove_Node(index){
        var tflag;
        if(
            this.nodes[index].x==this.max.x||this.nodes[index].y==this.min.x||
            this.nodes[index].x==this.max.y||this.nodes[index].y==this.min.y
            ){
                tflag=1;
            }
        this.nodes.splice(index,1);
        if(tflag)this.refresh_MinMax();
        this.after_nodes_Move(index,false);
    }
    /**移除所有顶点 */
    removeAll(){
        this.nodes.length=0;
        this._length_long_lut.length=0;
        this._all_lines_length=-1;
    }
    /** 在插入顶点或删除顶点后的操作
     * @param {number} index 修改的点的下标
     * @param {Boolean} f 插入还是删除
     */
    after_nodes_Move(index,f){
        var j=index?index-1:this.nodes.length-1,i=index;
        this._length_long_lut[j]=undefined;
        if(f){
            this._length_long_lut.splice(i,0,null);
        }
        else{
            this._length_long_lut.splice(i,1);
        }
        this._all_lines_length=-1;
        this.after_nodes_move_Delegate(i,f);
    }
    /** 修改顶点后的操作
     * @param {number} index 修改的点的下标
     */
    after_node_Change(index){
        this._length_long_lut[index]=undefined;
        this._all_lines_length=-1;
        this.after_node_change_Delegate(i);
    }
    /** 修改顶点
     * @param {number} index 修改顶点的下标
     * @param {Vector2} v 点的坐标
     * @return {Vector2} 返回当前修改的点
     */
    setNode(index,v){
        this.nodes[index].x=v.x;
        this.nodes[index].y=v.y;
        if(v.x>this.max.x)this.max.x=v.x;
            else if(v.y<this.min.x)this.min.x=v.x;
                 if(v.y>this.max.y)this.max.y=v.y;
            else if(v.y<this.min.y)this.min.y=v.y;
        return this.nodes[index];
    }
    /** 闭合路径 */
    seal(){
        if(!this.isClosed()){
            this.nodes.push(this.nodes[0].copy());
        }
    }
    /** 是否密封 */
    isClosed(){
        var l=this.nodes.length-1;
        return this.nodes[0].x==this.nodes[l].x&&this.nodes[0].y==this.nodes[l].y;
    }
    /**获取一个能正好包住多边形的矩形的x和y最小的顶点 */
    get_Min(){
        return this.min;
    }
    /**获取一个能正好包住多边形的矩形的x和y最大的顶点 */
    get_Max(){
        return this.max;
    }
    /** 使用局部坐标系判断某点是否在内部, 
     * @param {number} x 局部坐标系中的坐标
     * @param {number} y 局部坐标系中的坐标
     * @param {Boolean} f 是否认作是一个密封的多边形 为true时会多计算一个起点和终点的线
     */
    is_Inside(x,y,f){
        if(this.min.x>x||this.max.x<x||this.min.y>y||this.max.y<y) return false;
        var _cf=this.isClosed()||f;
        if(!_cf){
            // 如果图形不是密封的, 直接返回否
            return false;
        }
        var i,j,rtn=false,temp=0,tempK;
        i=this.nodes.length-1;
        if(this.nodes[i].x===x&&this.nodes[i].y===y) return true;
        for(;i>=0;--i){
            j=i-1;
            if(i===0){
                if(f){
                    if(!this.isClosed())
                        j=this.nodes.length-1;
                    else 
                        break;
                }else{
                    break;
                }
            }
            if(this.nodes[i].x==x&&this.nodes[i].y==y) return true;//如果正好在顶点上直接算在内部
            else if((this.nodes[i].y>=y)!=(this.nodes[j].y>=y)){
                // 点的 y 坐标 在范围内
                tempK=((temp=this.nodes[j].y-this.nodes[i].y)?
                        (((this.nodes[j].x-this.nodes[i].x)*(y-this.nodes[i].y))/(temp)+this.nodes[i].x):
                        (this.nodes[i].x)
                    );
                if(x==tempK){
                    // 斜率相等, 点在边线上 直接算内部
                    return true;
                }
                else if(x>tempK){
                    // 射线穿过
                    rtn=!rtn;
                }
            }
        }
        return rtn;
    }
    /** 平移
     * @param {Vector2} v
     */
    translate(v){
        var i;
        for(i=this.nodes.length-1;i>=0;--i){
            this.nodes[i].x+=v.x;
            this.nodes[i].y+=v.y;
        }
        this.min.x+=v.x;
        this.min.y+=v.y;
    }
    /** 线性变换
     * @param {Matrix2x2T} m    矩阵
     * @param {Boolean} fln     矩阵后乘向量 还是 矩阵前乘向量 默认矩阵前乘向量(false)
     * @param {Boolean} translate_befroeOrAfter 先平移还是先变换 默认先变换(false)
     * @param {Boolean} anchorPoint 变换锚点的坐标
     */
    linearMapping(m,fln=false,translate_befroeOrAfter=false,anchorPoint){
        for(var i=this.nodes.length-1;i>=0;--i){
            this.nodes[i].linearMapping(m,fln,translate_befroeOrAfter,anchorPoint);
        }
    }
    /** 生成代理用的多边形
     * @param {number} _accuracy 精度 在这里是无用的
     * @param {number} _closeFlag 是否需要封闭
     */
    create_PolygonProxy(_accuracy,_closeFlag){
        var rtn= this.copy();
        if(_closeFlag&&!rtn.isClosed()){
            rtn.seal();
        }
        return rtn;
    }
    /** 分割线段生成新顶点
     * @param {number} index 前驱顶点下标
     * @param {number} z     t参数
     * @return {Vector2} 新加入的顶点
     */
    cut(index,z){
        var i_next=index+1===this.node.length?index+1:0;
        if(this.nodes[index]===undefined||this.nodes[i_next]===undefined)return;
        var zd=1-z,
            newNode=new Vector2(zd*this.nodes[index].x+z*this.nodes[i_next].x,zd*this.nodes[index].y+z*this.nodes[i_next].y)
        
        i_next?this.nodes.splice(i_next,0,newNode):this.nodes.push(newNode);
        return newNode;
    }
    /** 点趋向于哪条边
     * @param {Vector2} point 点
     * @param {Boolean} want_to_close 将没闭合的路径视作闭合路径
     * @return {{i:number,l:number,k:number}}  i:线段前驱顶点的下标, l:点到线段的距离, k:点投影到线段的系数
     */
    get_PointInLine(point,want_to_close){
        var nodes=this.nodes;
        var min_l=Infinity,temp=0,ti=0,i=nodes.length-1,k=0;
        if(want_to_close){
            temp=Math2D.get_DistanceOfPointToLine(point,nodes[i],nodes[0]);
            min_l=temp;
            ti=i;
            k=temp.k;
        }
        --i;
        for(;i>=0;--i){
            if(min_l>(temp=Math2D.get_DistanceOfPointToLine(point,nodes[i],nodes[i+1])).length){
                min_l=temp.length;
                ti=i;
                k=temp.k;
            }
        }
        return {i:ti,l:min_l,k:k};
    }
    /** 点在顶点上或在多边形线段上 顶点优先
     * @param {Vector2} point 点
     * @param {number} r 顶点的计算半径 取负数将无法取到顶点
     * @param {number} lineWidth 线段容差宽度 超出距离不计 取负数将无法取到边
     * @param {Boolean} want_to_close 将没闭合的路径视作闭合路径
     * @return {{type:number,i:number,l:number,k:number}}
     * @return {number} type 在顶点上(0) 或 在边上(1)
     * @return {number} i 当前顶点下标 或边的前驱顶点下标
     * @return {number} l 点到目标的距离
     * @return {number} k 目标为边时点到边的投影的系数
     */
    pointInNodeOrLine(point,r,lineWidth,want_to_close){
        var nodes=this.nodes;
        var i=nodes.length-1,min=Infinity,temp=0,ti=i;
        if(r>0){
            for(;i>=0;--i){
                if(min<(temp=Math2D.get_LineLength(point,nodes[i]))){
                    min=temp;
                    ti=i;
                }
            }
            if(min<r){
                return {
                    type:0,
                    i:ti,
                    l:min,
                    k:0
                }
            }
        }
        if(lineWidth>0){
            var rtn=this.get_PointInLine(point,want_to_close);
            if(rtn.length<lineWidth){
                rtn.type=1;
                return rtn;
            }
        }
        return {
            type:-1,
            i:-1,
            l:Infinity,
            k:0
        }
    }
    /** 获取边的长度
     * @param {number} index 前驱顶点做为起点 如果是最后一个顶点则会视作 第一个和最后一个顶点 的线
     * @return {number} 返回线段的长度
     */
    get_LineLength(index){
        var j=index===this.nodes.length-1?0:index+1;
        if(this._length_long_lut[index]===undefined||this._length_long_lut[index]<0){
            this._length_long_lut[index]=Math2D.get_LineLength(this.nodes[index],this.nodes[j]);
        }
        return this._length_long_lut[index];
    }
    /** 多边形所有边的长度和
     * @param {Boolean} closeFlag 是否闭合多边形
     * @return {number}
     */
    get_LengthLong(closeFlag){
        if(this._all_lines_length<0||this._all_lines_length===undefined){
            var rtn=0;
            var i=this.nodes.length-1;
            if((!closeFlag)&&this.nodes.length>2){
                --i;
            }
            for(;i>=0;--i){
                rtn+=this.get_LineLength(i);
            }
            this._all_lines_length=rtn;
        }
        return this._all_lines_length;
    }
    /** 使用参数t获取多边形上的点的坐标和法向
     * @param {number} t 全多边形的时间参数t
     * @param {Boolean} closeFlag 是否闭合多边形
     * @return {{v:Vector2,n:Vector2}} v: 点的坐标, n: 当前点的法向(一个相对于v的标准化向量)
     */
    sample(t,closeFlag){
        var l=t*this.get_LengthLong(closeFlag),temp,
            i=0,j=0,
            lt,
            v,n;
        while(l>(temp=this.get_LineLength(i))){
            l-=temp;
            ++i;
        }
        lt=l/this.get_LineLength(i);
        j=i===this.nodes.length-1?0:i+1;
        v=Math2D.sample_Line(this.nodes[i],this.nodes[j],lt);
        n=Vector2.dif(this.nodes[j],this.nodes[i]).normalize().linearMapping(Matrix2x2.ROTATE_90);
        return {v:v,n:n};
    }
    
    /** 用于同一接口的函数, 不推荐使用。 
     * 使用参数t获取多边形上的点的坐标和法向
     * @param {number} t 全多边形的时间参数t
     * @param {Boolean} closeFlag 是否闭合多边形
     * @return {Vector2} v: 点的坐标, n: 当前点的法向(一个相对于v的标准化向量)
     */
    sample__ByLengthLong(t,closeFlag){
        return this.sample(t,closeFlag).v;
    }
    /** 创建矩形
     */
    static create_Rect(x,y,width,height){
        var ret=new Polygon();
        ret.add_Node(new Vector2(x,y));
        ret.add_Node(new Vector2(x+width,y));
        ret.add_Node(new Vector2(x+width,y+height));
        ret.add_Node(new Vector2(x,y+height));
        ret.seal();
        return ret;
    }
    /** 生成拟合弧形的多边形, 如果弧度的 绝对值 大于 2π 将作为圆形而不是弧形
     * @param {number} r                半径
     * @param {number} startAngle       开始的弧度(rad)
     * @param {number} endAngle         结束的弧度(rad)
     * @param {number} _accuracy         精度 最小为2, 表示弧形由个顶点构成
     * @param {Boolean} _closeFlag 当不足为整个圆时 是否要封闭
     */
    static create_Arc(r,_startAngle,_endAngle,_accuracy,_closeFlag){
        var rtn=new Polygon();
        var accuracy=_accuracy>=2?_accuracy:2,
            startAngle,endAngle,cyclesflag,
            stepLong,
            i,tempAngle;
        // if(anticlockwise){
        //     // 逆时针
        //     startAngle=_endAngle;
        //     endAngle=_startAngle;
        // }
        // else{
        //     // 顺时针
            startAngle=_startAngle;
            endAngle=_endAngle;
        // }
        if(endAngle-startAngle>=cycles||endAngle-startAngle<=-1*cycles){
            // 如果弧度 绝对值 大于 2π 将作为圆形而不是弧形
            stepLong=cycles/accuracy;
            cyclesflag=true;
        }
        else{
            stepLong=(endAngle-startAngle)/(accuracy-1);
        }
        for(i=accuracy-1;i>=0;--i){
            tempAngle=endAngle-i*stepLong;
            rtn.add_Node(new Vector2(Math.cos(tempAngle)*r,Math.sin(tempAngle)*r));
        }
        if(cyclesflag||_closeFlag){
            rtn.seal();
        }
        return rtn;
    }
    static sector(r,_startAngle,_endAngle,_accuracy){
        var rtn=Polygon.create_Arc(r,_startAngle,_endAngle,_accuracy,false);
        if((endAngle-startAngle>=cycles||endAngle-startAngle<=-1*cycles)) return rtn;
        rtn.insert_Node(0,new Vector2(0,0));
        rtn.add_Node(new Vector2(0,0));
        return rtn;
    }
    /** 获取两个多边形的相交次数
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return {number}    相交的次数
     */
    static getImpactCount(_polygon1,_polygon2){
        //  当两个多边形的角碰到角的时候，会出现两次计算，会比预算结果多1
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return 0;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        var f=0;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                f+=Math2D.get_intersectionOfLineLine_f(vl1[i],vl1[i+1],vl2[j],vl2[j+1]);
            }
        }
        return f;
    }
    /** 获取两个多边形是否相交
     * @param   {Polygon}   _polygon1
     * @param   {Polygon}   _polygon2
     * @return {boolean}   是否相交
     */
    static getImpactFlag(_polygon1,_polygon2){
        if(_polygon1.minX>_polygon2.maxX||_polygon2.minX>_polygon1.maxX||_polygon1.minY>_polygon2.maxY||_polygon1.minY>_polygon1.maxY)return false;
        var vl1=_polygon1.nodes,vl2=_polygon2.nodes;
        var i=vl1.length-1,j;
        for(--i;i>=0;--i){
            for(j=vl2.length-2;j>=0;--j){
                if(Math2D.get_intersectionOfLineLine_f(vl1[i],vl1[i+1],vl2[j],vl2[j+1]))
                return true;
            }
        }
        return false;
    }
    /** 矩阵和多边形内部所有向量变换, 根据实参的顺序重载后乘对象
     * (p,m)行向量后乘矩阵
     * (m,p)矩阵后乘列向量
     * @param {Matrix2x2T} m 矩阵
     * @param {Polygon} p 多边形
     * @param {Boolean} translate_befroeOrAfter 先平移或后平移; 默认后平移(默认false)
     * @return {Polygon} 返回一个新的多边形
     */
    static linearMapping(p,m,translate_befroeOrAfter=false){
        return Polygon.EX_LinearMapping(p,m,!!translate_befroeOrAfter);
    }
    static EX_LinearMapping(p,m,translate_befroeOrAfter){}
    static EX_linearMapping_Nt(p,m,translate_befroeOrAfter){}
}

/** 贝塞尔曲线的数据
 */
class BezierCurve{
    /** @param {Vector2[]} points 控制点们 Vector2
     */
    constructor(points){
        /**@type {Vector2[]} 曲线控制点*/
        this._points=null;
        /**@type {number[]} x 坐标的 计算系数*/
        this._coefficient_x=null;
        /**@type {number[]} y 坐标的 计算系数*/
        this._coefficient_y=null;
        /**@type {BezierCurve} 导函数*/
        this._derivatives=null;
        /**@type {Data_Rect} 轴对齐边界框*/
        this._aabb=null;
        /**@type {BezierCurve} 对齐后的曲线的代理 用于求紧包围框*/
        this._align_proxy=null;
        /**@type {Matrix2x2} 对齐曲线使用的矩阵 用于求紧包围框*/
        this._align_matrix=null;
        /**@type {Matrix2x2} 对齐曲线使用的矩阵的逆矩阵 用于求紧包围框*/
        this._align_matrix_i=null;
        /**@type {Polygon} 多边形代理,拟合曲线的多边形*/
        this._polygon_proxy=null;
        /**@type {number} 多边形代理的步长*/
        this._polygon_proxy_sp=0;
        /**@type {number} 目标的多边形代理的步长,如果和_polygon_proxy_sp不同时，get访问器会重新生成多边形代理*/
        this._polygon_proxy_want_sp;
        this.polygon_proxy_want_sp=0.1;
        /**@type {{t:number,l:number}[]} 弧长显式查找表 */
        this._length_long_lut=null;
        if(points) this.reset_Points(points);
        /**@type {Object} t参数对应的点的集合 */
        this._point_t={};
    }
    /** 清空所有代理对象和导函数, 应该在控制点或计算系数改动时使用
     */
    clearProxy(){
        this._derivatives=null;
        this._align_proxy=null;
        this._align_matrix=null;
        this._align_matrix_i=null;
        this._polygon_proxy=null;
        this._polygon_proxy_sp=0;
        this._length_long_lut=null;
        this._aabb=null;
        this._point_t={};
    }
    /** 清空控制点
     */
    clearPoints(){
        this._points=null;
    }
    /** 重新设置控制点
     * @param {Vector2} points 控制点们 Vector2
     */
    reset_Points(points){
        this._derivatives=null;
        if(points&&points.length){
            this._points=new Array(points.length);
            for(var i=points.length-1;i>=0;--i){
                this._points[i]=Vector2.copy(points[i]);
            }
            this.refresh_Coefficient();
        }
        this.clearProxy();
    }
    /** 重新设置系数
     * @param {number[]} coefficient_x X系数
     * @param {number[]} coefficient_y Y系数
     */
    reset_Coefficient(coefficient_x,coefficient_y){
        this._coefficient_x=coefficient_x.concat();
        this._coefficient_y=coefficient_y.concat();
    }
    /** 拷贝函数
     * @param {BezierCurve} bezierCurve 
     * @return {BezierCurve}
     */
    static copy(bezierCurve){
        var rtn=new BezierCurve();
        if(bezierCurve.points&&bezierCurve.points.length){
            rtn._points=new Array(bezierCurve._points.length);
            for(var i=rtn._points.length-1;i>=0;--i){
                rtn._points[i]=Vector2.copy(bezierCurve._points[i]);
            }
        }
        rtn.coefficient_x=bezierCurve.coefficient_x;
        rtn.coefficient_y=bezierCurve.coefficient_y;
        return rtn;
    }
    copy(){
        return BezierCurve.copy(this);
    }
    set points(points){
        this.reset_Points(points);
    }
    /** @return {Vector2[]}
     */
    get points(){
        if(this._points===null){
            this.refresh_Points();
        }
        return this._points;
    }
    set coefficient_y(coefficient_y){
        this._coefficient_y=coefficient_y;
        this.clearPoints();
    }
    set coefficient_x(coefficient_x){
        this._coefficient_x=coefficient_x;
        this.clearPoints();
    }
    get coefficient_y(){
        return this._coefficient_y;
    }
    get coefficient_x(){
        return this._coefficient_x;
    }
    /** @return {BezierCurve} 返回一条对齐到x轴后的曲线
     */
    get align_proxy(){
        if(this._align_proxy===null){
            this.refresh_Align();
        }
        return this._align_proxy;
    }
    /** @type {number} 拟合多边形 t 步长 */
    get polygon_proxy_want_sp(){
        return this._polygon_proxy_want_sp;
    }
    /** @type {number} 拟合多边形 t 步长 */
    set polygon_proxy_want_sp(step_size){
        var sp=Math.abs(step_size);
        this._polygon_proxy_want_sp=sp>1?1:sp;
    }
    /** 重新加载对齐后的曲线 (将起点作为原点,起点to终点的线与x正方向对齐的曲线)
     */
    refresh_Align(){
        var d=this.points[this.points.length-1].dif(this.points[0]),
            nd=d.copy().normalize();
            // var m=new Matrix2x2T().set_Translate(di.x,di.y),
        var m=Matrix2x2T.create_ByVector2(nd).set_Translate(-this.points[0].x,-this.points[0].y);
        this._align_matrix=m;
        this._align_matrix_i=m.create_Inverse();
        this._align_proxy=BezierCurve.copy(this);
        this._align_proxy.linearMapping(this._align_matrix,false,true);
    }
    /** 设置控制点之后, 重新加载 各次幂的系数
     */
    refresh_Coefficient(){
        var points=this.points,
            n=points.length-1,
            m=getBezierMatrix(n);
        this._coefficient_x=new Array(points.length);
        this._coefficient_y=new Array(points.length);
        var i,j,tempx,tempy;
        for(i=n;i>=0;--i){
            tempx=tempy=0;
            for(j=i;j>=0;--j){
                tempx+=m[i][j]*points[j].x;
                tempy+=m[i][j]*points[j].y;
            }
            this._coefficient_x[i]=tempx;
            this._coefficient_y[i]=tempy;
        }
    }
    /** 设置系数后, 重新加载 控制点坐标
     */
    refresh_Points(){
        this._points=Vector2.create_ByArray(
            coefficientToPoints(this._coefficient_x),
            coefficientToPoints(this._coefficient_y)
        );
        this.clearProxy();
    }
    /** 使用矩阵进行线性变换
     * @param {Matrix2x2T}  m   变换矩阵
     * @param {Boolean}     fln 向量前乘还是前后乘矩阵  默认是前乘 (默认为true) 
     * @param {Boolean}     f   先平移还是先变换 默认先变换再平移 (默认为false) 
     * @param {Vector2}     anchorPoint   锚点的坐标 变换会以锚点为中心 默认 (0,0)
     * @return {BezierCurve} 返回this
     */
    linearMapping(m,fln,f,anchorPoint){
        for(var i=this.points.length-1;i>=0;--i){
            this.points[i].linearMapping(m,fln,f,anchorPoint);
        }
        this.refresh_Coefficient();
        this.clearProxy();
        return this;
    }
    /** 获取 x 坐标
     * @param {number} t t 参数
     * @return {number}
     */
    sample_x(t){
        var rtn=0;
        for(var i = this._coefficient_x.length-1;i>=0;--i){
            rtn*=t;
            rtn+=this._coefficient_x[i];
        }
        return rtn;
    }
    /** 获取 y 坐标
     * @param {number} t t 参数
     * @return {number}
     */
    sample_y(t){
        var rtn=0;
        for(var i = this._coefficient_y.length-1;i>=0;--i){
            rtn*=t;
            rtn+=this._coefficient_y[i];
        }
        return rtn;
    }
    /** 获取坐标
     * @param {number} t t 参数
     * @return {Vector2} 返回坐标
     */
    sample(t){
        return this._point_t[t]||(this._point_t[t]=new Vector2(this.sample_x(t),this.sample_y(t)));
    }
    /** 使用弧长线性的采样 
     * @param {number} t t 参数
     * @return {Vector2} 返回坐标
     */
    sample__ByLengthLong(t){
        var _t=this.get_t_ByLengthLong(this.get_LengthLong()*t);
        return this.sample(_t);
    }
    /** 使用弧长线性的t to bezier曲线采样算法的t的映射函数
     * @param {number} t t 参数
     * @return {number} 采样算法的t参数
     */
    get_t_T(t){
        return this.get_t_ByLengthLong(this.get_LengthLong()*t);
    }
    /** 导函数
     * @return {BezierCurve}低一阶的贝塞尔曲线
     */
    get derivatives(){
        if(!(this._coefficient_x.length||this._coefficient_y.length)){
            return null;
        }
        if(this._derivatives===null){
            // this._derivatives=new BezierCurve(Math2D.get_BezierDerivativesPoints(this.points));
            this._derivatives=new BezierCurve();
            this._derivatives.reset_Coefficient(
                derivative(this._coefficient_x),
                derivative(this._coefficient_y)
            );
        }
        return this._derivatives;
    }
    /** 获取当前点的移动方向
     * @param {number} t 时间参数 t
     * @return {Vector2[]} 返回曲线上的点和导数的绝对坐标
     */
    get_Tangent(t){
        var pt=this.sample(t),
            d=Vector2.sum(pt,this.derivatives.sample(t));
        return [pt,d];
    }
    /** 当前点的法线 绝对坐标
     * @param {number} 时间参数 t
     * @param {Vector2} 返回曲线上的点和法向的绝对坐标
     */
    get_normal_Abs(t){
        var pt=this.sample(t),
            d=Vector2.sum(pt,this.get_Normal(t));
        return [pt,d];
    }
    /** 当前点的法线
     * @param {number} 时间参数 t
     * @param {Vector2} 返回一个 pt 的相对坐标 这是一个标准化向量
     */
    get_Normal(t){
        var d=this.derivatives.sample(t);
        return new Vector2(
            d.y,
            -d.x
        ).normalize()
    }
    /** 获取当前点的导数
     * @param {number} t 时间参数 t
     * @return {Vector2} 返回一个相对坐标
     */
    derivative(t){
        return this.derivatives.sample(t);
    }
    /** 获取曲线的 根 的 t 参数
     * 目前只能得到四阶以下曲线的根
     * @param {number} ddepth 取到几阶导数的根 默认取全部
     * @param {Boolean} range_flag 是否要取超过t的合法取值范围(0~1) 默认不超过
     * @return {number[]} 返回导函数的根的 t 参数集合
     */
    get_root_t(ddepth,range_flag){
        var depth=ddepth===undefined?Infinity:ddepth;
        if(depth<=0){
            return [];
        }
        var rtn=this.derivatives?rootsOfCubic(this.derivatives.coefficient_x).concat(rootsOfCubic(this.derivatives.coefficient_y)).concat(this.derivatives.get_root_t(depth-1)):[];
        if(!range_flag){
            rtn=rtn.filter(BezierCurve.is_TRange);
        }
        return rtn;
    }
    /** 获取曲线的 根 的 t 参数
     * 目前只能得到四阶以下曲线的根
     * @param {Boolean} range_flag 是否要取超过t的合法取值范围(0~1) 默认不超过
     * @return {Vector2[]} 返回曲线的根的集合
     */
    get_root_v(range_flag){
        var pts=this.get_root_t(range_flag),
            i=pts.length,
            rtn=new Array(i)
        for(--i;i>=0;--i){
            rtn[i]=this.sample(pts[i]);
        }
        return rtn;
    }
    /** 轴对齐包围框 (边界框) axis aligned bounding box
     * @return {Data_Rect} 轴对齐包围框 (边界框) axis aligned bounding box
     */
    get_AABB(){
        if(this._aabb===null){
            var pts=this.get_root_v().concat([this.sample(0),this.sample(1)]),
                max=new Vector2(),
                min=new Vector2();
            max.x=pts[0].x;
            max.y=pts[0].y;
            min.x=pts[0].x;
            min.y=pts[0].y;
            for(var i=pts.length-1;i>=0;--i){
                    if(pts[i].x>max.x)max.x=pts[i].x;
                else if(pts[i].x<min.x)min.x=pts[i].x;
                    if(pts[i].y>max.y)max.y=pts[i].y;
                else if(pts[i].y<min.y)min.y=pts[i].y;
            }
            this._aabb = Data_Rect.create_ByVector2(min,max);
        }
        return this._aabb;
    }
    /** aabb的最小坐标
     * @return {Vector2}
     */
    get_Min(){
        return this.get_AABB().get_Min();
    }
    /** aabb的最大坐标
     * @return {Vector2}
     */
    get_Max(){
        return this.get_AABB().get_Max();
    }
    /** 获取紧包围框
     * @return {Polygon}
     */
    get_TightBoundsBox(){
        var pts=this.align_proxy.get_root_v().concat([this.align_proxy.sample(0),this.align_proxy.sample(1)]),
            max=new Vector2(),
            min=new Vector2();
        max.x=pts[0].x;
        max.y=pts[0].y;
        min.x=pts[0].x;
        min.y=pts[0].y;
        for(var i=pts.length-1;i>=0;--i){
                 if(pts[i].x>max.x)max.x=pts[i].x;
            else if(pts[i].x<min.x)min.x=pts[i].x;
                 if(pts[i].y>max.y)max.y=pts[i].y;
            else if(pts[i].y<min.y)min.y=pts[i].y;
        }
        var p_lb=new Vector2(min.x,max.y),
            p_rt=new Vector2(max.x,min.y),
            polygon=new Polygon([min,p_rt,max,p_lb]);
        polygon.linearMapping(this._align_matrix_i,false,false);
        return polygon;
    }
    /** t 是否在合法的取值范围
     * @param {number} t 
     */
    static is_TRange(t){
        return t>=0&&t<=1;
    }
    /** 曲线的拐点 仅用于三阶曲线
     * @return {number[]} 曲线拐点的 t 参数的集合
     */
    get_Inflections(){
        var points=this.align_proxy.points,
            a=points[2].x*points[1].y,
            b=points[3].x*points[1].y,
            c=points[1].x*points[2].y,
            d=points[3].x*points[2].y,
            z=c-a,
            y=-3*z-b,
            x=-y+b-d,
            x2=2*x,
            k=y*y-2*x2*z;
            if(x2===0){
                return [-z/y];
            }
            if(k>=0){
                var q = Math.sqrt(k)
                return [(q - y) / x2, (-y - q) / y2];
            }
            return [];
    }
    /** 使用坐标求t值
     * @param {number} x X坐标
     * @return 对应的t值
     */
    get_t_ByX(x){
        var temp=this.coefficient_x.concat();
        temp[0]-=x;
        return rootsOfCubic(temp).filter(BezierCurve.is_TRange);
    }
    /** 使用坐标求t值
     * @param {number} y Y坐标
     * @return 对应的t值
     */
    get_t_ByY(y){
        var temp=this.coefficient_y.concat();
        temp[0]-=y;
        return rootsOfCubic(temp).filter(BezierCurve.is_TRange);
    }
    /** 求弧长
     * @param {number} step_size t 时间参数的采样步长, 设置越接近0精度越高; 默认为 0.1 或者保留原有的
     * @return {number} 使用多边形拟合曲线求得的长度
     */
    get_LengthLong(step_size){
        if(step_size) this.polygon_proxy_want_sp=Math.abs(step_size);
        var tb=this.length_long_lut;
        return tb[tb.length-1].l;
    }
    /** 使用弧长求t值
     * @param {number} length 当前弧长, 为负数时使用终点开始算; 当弧长超出取值范围时取0
     * @param {number} step_size t 时间参数的采样步长, 设置越接近0精度越高; 默认为 0.1 或者保留原有的
     * @return {number} 对应的时间参数t
     */
    get_t_ByLengthLong(length,step_size){
        if(step_size) this.polygon_proxy_want_sp=step_size;
        var tb=this.length_long_lut,
            i=tb.length-1,
            l=length>=0?length:tb[i].l+length;
        for(--i;i>=0;--i){
            if(tb[i].l<l){
                // return this._polygon_proxy_sp*(i+(l-tb[i])/(tb[i+1]-tb[i]))
                if(tb[i+1]){
                    return tb[i].t+(l-tb[i].l)/(tb[i+1].l-tb[i].l)*(tb[i+1].t-tb[i].t);
                }
                return 0
            }
        }
        return 0;
    }
    /** 弧长显式查找表 */
    get length_long_lut(){
        var polygon=this.polygon_proxy;
        if(this._length_long_lut[0].l===null){
            var temp;
            this._length_long_lut[0].l=0;
            for(var i=1;i<polygon.nodes.length;++i){
                temp=polygon.nodes[i].dif(polygon.nodes[i-1]).get_Mag();
                this._length_long_lut[i].l=this._length_long_lut[i-1].l+temp;
            }
        }
        return this._length_long_lut;
    }
    /**@type {Polygon} 拟合曲线的多边形 */
    get polygon_proxy(){
        if(this._polygon_proxy===null||this._polygon_proxy_sp!==this.polygon_proxy_want_sp){
            var temp=this.create_PolygonProxy(this.polygon_proxy_want_sp);
            this._polygon_proxy_sp=this.polygon_proxy_want_sp;
            this._polygon_proxy=temp.polygon;
            this._length_long_lut=temp.t_lut;
        }
        return this._polygon_proxy;
    }
    /** 创建多边形拟合曲线
     * @param {number} step_size t 时间参数的步长, 设置越接近0精度越高; 默认为 0.1
     * @return {polygon:Polygon,t_lut:{t:number,l:null}[]} 返回 拟合曲线的多边形 和 t与弧长显示查找表的(只有t,未计算弧长)
     */
    create_PolygonProxy(step_size){
        var sp=Math.abs(step_size)||0.1,
            temp=[];
        var length_long_lut=[];
        for(var i = 0; i<1; i+=sp){
            temp.push(this.sample(i));
            length_long_lut.push({t:i,l:null});
        }
        temp.push(this.sample(1));
        length_long_lut.push({t:1,l:null});
        return {polygon:new Polygon(temp),t_lut:length_long_lut}
    }
    /** 某点的曲率
     * @param {number} t 时间参数 t
     * @return {number} 当前点曲率
     */
    get_Kappa(t){
        var d = this.derivative(t),
            dd = this.derivatives.derivative(t),
            numerator = d.x * dd.y - dd.x * d.y,
            denominator = Math.pow(d.x*d.x + d.y*d.y, 3/2);
        // if (denominator === 0) return NaN;
        return numerator / denominator
    }
    /** 当前点的曲率拟合圆
     * @param {number} t 时间参数 t
     * @param {Data_Arc} tgtData 目标 data, 该参数传入后值将会被修改并返回，而不是返回新实例化的数据
     * @return {Data_Arc} 当前点曲率拟合圆
     */
    create_KappaCircle(t,tgtData){
        var kr=-1/this.get_Kappa(t),
            pt=this.sample(t),
            n=this.get_Normal(t),
            c=pt.sum(n.np(kr));
        kr=Math.abs(kr);
        if(tgtData){
            tgtData.c=c;
            tgtData.r=kr;
        }
        return new Data_Arc(c.x,c.y,kr,0,2*Math.PI);
    }
    /** 点投影到曲线上 搜索基础点
     * @param {Vector2} v    点的坐标
     * @param {string} type 使用什么搜索 "arcLiength"||"t" 默认用t
     * @param {number} step_size   搜索时的采样步长(0<sp<1) 值越小精度越高 默认为 this.polygon_proxy_want_sp
     * @return {{v1,v2,v3}} 接近点坐标的三个采样
     * @return {{t:number,v:Vector2,l:number}} v1 最近的点的前一个
     * @return {{t:number,v:Vector2,l:number}} v2 最近的点的当前点
     * @return {{t:number,v:Vector2,l:number}} v3 最近的点的后一个点
     */
    created_ProjectionPointFirst(v,type,step_size){
        var type=type||'t',
            step_size=step_size===undefined?this.polygon_proxy_want_sp:(this.polygon_proxy_want_sp=step_size);

        var al=this.get_LengthLong(),
            temp_t,
            tv,
            temp={v1:null,v2:null,v3:null},
            rtn ={v1:null,v2:{l:Infinity},v3:null};
        for(var i=0,j=0;i!==1;i+=step_size,i>=1?i=1:1,++j){
            temp.v1=temp.v2;
            temp.v2=temp.v3;
            if(type==='t'){
                temp.v3={
                    t:(temp_t=i),
                    v:(tv=this.polygon_proxy.nodes[j]),
                };
            }else{
                temp.v3={
                    t:(temp_t=this.get_t_ByLengthLong(al*i)),
                    v:(tv=this.sample(temp_t)),
                };
            }
            temp.v3.l=Math2D.get_LineLength(tv,v);
            
            if(temp.v3.l<rtn.v2.l){
                rtn.v1=temp.v2;
                rtn.v2=temp.v3;
                rtn.v3=null;
            }
            if(temp.v2===rtn.v2){
                rtn.v3=temp.v3;
            }
        }
        if(!rtn.v1){
            rtn.v1=rtn.v3;
        }
        if(!rtn.v3){
            rtn.v3=rtn.v1;
        }
        return rtn;
    }
    /** 点投影到曲线上 二分法逼近
     * @param {Vector2} v    点的坐标
     * @param {{v1,v2,v3}} basics_points   基础点
     * @param {number} accuracy      逼近时的采样精度(0<sp<1) 值越小精度越高 默认0.0001
     * @return {{t:number,v:Vector2,l:number}} 投影信息
     */
    refine_projectionPoint_HalfApproximation(v,basics_points,accuracy){
        var accuracy=accuracy||0.0001;
        if(approximately(basics_points.v2.t,basics_points.v3.t,accuracy)){
            // 精度足够
            return basics_points.v1.l<basics_points.v2.l?
            basics_points.v1.l<basics_points.v3.l?basics_points.v1:basics_points.v3:
            basics_points.v2.l<basics_points.v3.l?basics_points.v2:basics_points.v3;
        }else{
            // 精度不足
            var f=basics_points.v1.l<basics_points.v3.l,
                temp=f?basics_points.v1:basics_points.v3,
                nv2t,nv2v;
            var nv2={
                t:(nv2t=0.5*(basics_points.v2.t+temp.t)),
                v:(nv2v=this.sample(nv2t)),
                l:Math2D.get_LineLength(nv2v,v)
            }
            return this.refine_projectionPoint_HalfApproximation(v,{
                v1:basics_points.v2,
                v2:nv2,
                v3:temp,
            })
        }
    }
    /** 点在曲线的投影
     * @param {Vector2} v 点
     * @param {string} type 粗搜索时使用的采样类型 默认使用t值搜索 "arcLiength"||"t"
     * @param {number} step_size 粗搜索采样步长 0~1 越小精度越高 默认为 this.polygon_proxy_want_sp
     * @param {number} accuracy  逼近精度 0~1 越小精度越高
     * @return {{t:number,v:Vector2,l:number}} 投影信息
     */
    create_ProjectionPoint(v,type="t",step_size,accuracy=0.001){
        return this.refine_projectionPoint_HalfApproximation(v,this.created_ProjectionPointFirst(v,type,step_size),accuracy);
    }
    /** 圆形与曲线的交点
     * @param {Vector2} c 圆心
     * @param {Vector2} r 半径
     * @param {string} type 粗搜索时使用的采样类型 默认使用t值搜索 "arcLiength"||"t"
     * @param {number} step_size 粗搜索采样步长 0~1 越小精度越高 默认为 this.polygon_proxy_want_sp
     * @param {number} accuracy  逼近精度 0~1 越小精度越高
     * @return {Vector2[]} 返回 交点的坐标集合
     */
    intersect_Circular(c,r,type="t",step_size,accuracy=0.001){
        return this.intersect_circular_point_Refining(c,r,this.intersect_circular_first_by_ArcLiength(c,r,type,step_size),accuracy);
    }
    /** 圆形与曲线的交点 搜索基础点
     * @param {Vector2} c 圆心
     * @param {Vector2} r 半径
     * @param {string} type 使用什么搜索 "arcLiength"||"t" 默认用t
     * @param {number} step_size   搜索时的采样步长(0<sp<1) 值越小精度越高 默认为 this.polygon_proxy_want_sp
     * @return {{t:number,v:Vector2}[][2]} 返回 交点坐标组合的集合
     */
    intersect_circular_first_by_ArcLiength(c,r,type,step_size){
        var type=type||'t',
            step_size=step_size===undefined?this.polygon_proxy_want_sp:(this.polygon_proxy_want_sp=step_size);

        var al=this.get_LengthLong(),
            temp_t,
            tv,
            temp= {v1:null,v2:null,v3:null},
            rtn = [];
        for(var i=0,j=0;i!==1;i+=step_size,i>=1?i=1:1,++j){
            temp.v1=temp.v2;
            if(type==='t'){
                temp.v2={
                    t:(temp_t=i),
                    v:(tv=this.polygon_proxy.nodes[j]),
                };
            }else{
                temp.v2={
                    t:(temp_t=this.get_t_ByLengthLong(al*i)),
                    v:(tv=this.sample(temp_t)),
                };
            }
            if(temp.v1&&(Math2D.get_intersectionOfCircleLine_V(temp.v1.v,temp.v2.v,c,r).length)){
                // 相交
                rtn.push([
                    temp.v1,
                    temp.v2
                ])
            }
        }
        return rtn;
    }
    /** 圆形与曲线的交点 二分逼近
     * @param {Vector2} c 圆心
     * @param {Vector2} r 半径
     * @param {{t:number,v:Vector2}[][]} basics_points   基础交点组合集合
     * @param {number} accuracy      逼近时的采样精度(0<sp<1) 值越小精度越高 默认0.0001
     * @return {Vector2[]} 返回 交点的坐标集合
     */
    intersect_circular_point_Refining(c,r,basics_points,accuracy){
        var accuracy=accuracy||0.0001;
        var rtn=[],temp,tp1,tp2,tp;
        var nv2t,nv2v;
        
        while(basics_points[0]){
            temp=basics_points[0];
            basics_points.shift();
            if(approximately(Math2D.get_LineLength(tp=temp[0].v,c),r,accuracy)||approximately(Math2D.get_LineLength(tp=temp[1],c),r)){
                // 点到圆心距离相近半径 精度足够
                rtn.unshift(tp);
                continue;
            }
            // 精度不足
            if(Math2D.get_intersectionOfCircleLine_V(temp[0].v,temp[1].v,c,r).length){
                // 有相交
                tp1=[
                    temp[0],
                    {
                        t:(nv2t=0.5*(temp[0].t+temp[1].t)),
                        v:(nv2v=this.sample(nv2t)),
                    }
                ];
                tp2=[
                    tp1[1],
                    temp[1]
                ];
                basics_points.unshift(tp1,tp2);
            }
            // 无相交无动作
        }
        return rtn;
    }
}

/** 用来求交点的边界框, 需要事先确定曲线的单调性 属性全只读
 */
class Unilateral_Bezier_Box{
    constructor(b,t1,t2){
        this.b=b;
        this.t1=t1||0;
        this.t2=t2||1;
        /**@type {Vector2}  */
        this.v1;
        /**@type {Vector2}  */
        this.v2;
        /**@type {number} 细分迭代次数 */
        this.iterations=0;
        /**@type {Unilateral_Bezier_Box[]} 配对的边界框 */
        this.sb=[];
    }
    /**进一步细分
     * @return {Unilateral_Bezier_Box[]}
     */
    ex_Box(){
        var b=this.b,
            b1=new Unilateral_Bezier_Box(b),
            b2=new Unilateral_Bezier_Box(b),
            p=0.5*(this.t1+this.t2),
            pt=this.b.sample(p);
        b1.t1=this.t1||0;
        b1.t2=b2.t1=p;
        b2.t2=this.t2;
        b1.v1=this.v1||this.b.sample(this.t1);
        b1.v2=pt;
        b2.v1=pt;
        b2.v2=this.v2||this.b.sample(this.t2);

        // 刷新配对 迭代次数计数器+1
        b1.sb=this.sb.concat();
        b2.sb=this.sb.concat();
        b1.iterations=this.iterations+1;
        b2.iterations=this.iterations+1;

        for(var i=this.sb.length-1;i>=0;--i){
            this.sb[i].sb.splice(this.sb[i].sb.indexOf(this),1,b1,b2);
        }

        return [b1,b2];
    }
    /**@return {boolean} 是否足够精度 */
    has_Accuracy(_accuracy){
        if(!(this.v2&&this.v1)){
            this.v1=this.b.sample(0);
            this.v2=this.b.sample(1);
        }
        return (Math.abs(this.v2.x-this.v1.x)<_accuracy)&&(Math.abs(this.v2.y-this.v1.y)<_accuracy);
    }
    /**清除无重叠的配对 */
    weed_Out(){
        for(var i=0;i<this.sb.length;++i){
            if(!this.has_Overlap(this.sb[i])){
                this.sb[i].sb.splice(this.sb[i].sb.indexOf(this),1);
                this.sb.splice(i,1);
                --i;
            }
        }
    }
    /** box是否有重叠
     * @param {Unilateral_Bezier_Box} bb 另一个实例
     * @return {boolean}
     */
    has_Overlap(bb){
        var v11=this.v1 ||this.b.sample(this.t1),
            v12=this.v2 ||this.b.sample(this.t2),
            v21=bb.v1   ||  bb.b.sample(  bb.t1),
            v22=bb.v2   ||  bb.b.sample(  bb.t2);
        return Math2D.get_intersectionOfBoxBox_f(v11,v12,v21,v22);
    }
    /** 立刻使用向量求交, 如果曲线的导数差异较大可能会导致求交失败
     * @return {Vector2[]}
     */
    all_get_intersectionOfLineLine_f(){
        var tb,rtn=[];
        for(var i=this.sb.length-1;i>=0;--i){
            tb=this.sb[i];
            rtn.push(Math2D.get_intersectionOfLineLine_v(this.v1.x,this.v1.y,this.v2.x,this.v2.y,tb.v1.x,tb.v1.y,tb.v2.x,tb.v2.y));
        }
        return rtn;
    }
    /** 立刻使用向量求交, 如果曲线的导数差异较大可能会导致求交失败
     * @param {Unilateral_Bezier_Box} 
     * @return {Vector2}
     */
    get_intersectionOfLineLine_f(bb){
        return Math2D.get_intersectionOfLineLine_v(this.v1.x,this.v1.y,this.v2.x,this.v2.y,bb.v1.x,bb.v1.y,bb.v2.x,bb.v2.y);
    }
}
// 函数重载 -------------------------------------------------------------------------------------------
do{
    Vector2.linearMapping__Base=Overload_Function.create();
    Vector2.linearMapping__Base.addOverload([Vector2,Matrix2x2],function(v,m){
        var rtn = new Vector2(
            v.x*m.a+v.y*m.c,
            v.x*m.b+v.y*m.d
        )
        return rtn;
    },"行向量后乘矩阵");
    Vector2.linearMapping__Base.addOverload([Vector2,Matrix2x2,Vector2],function(v,m,a){
        var rtn = new Vector2(v.x-a.x,v.y-a.y);
        rtn.x=rtn.x*m.a+rtn.y*m.c;
        rtn.y=rtn.x*m.b+rtn.y*m.d;
        rtn.x+=a.x;
        rtn.y+=a.y;
        return rtn;
    },"行向量后乘矩阵+锚点");
    Vector2.linearMapping__Base.addOverload([Matrix2x2,Vector2],function(m,v){
        var rtn = new Vector2(
            v.x*m.a+v.y*m.b,
            v.x*m.c+v.y*m.d
        );
        return rtn;
    },"矩阵后乘列向量");
    Vector2.linearMapping__Base.addOverload([Matrix2x2,Vector2,Vector2],function(m,v,a){
        var rtn = new Vector2(v.x-a.x,v.y-a.y);
        rtn.x=rtn.x*m.a+rtn.y*m.b;
        rtn.y=rtn.x*m.c+rtn.y*m.d;
        rtn.x+=a.x;
        rtn.y+=a.y;
        return rtn;
    },"矩阵后乘列向量+锚点");
    Polygon.EX_linearMapping=Overload_Function.create();
    Polygon.EX_linearMapping.addOverload([Polygon,Matrix2x2,Boolean],function(p,m,f){
        var i=0,
            rtn=new Polygon();
        for(;i<p.nodes.length;++i){
            rtn.add_Node(Vector2.linearMapping(p.nodes[i],m,f));
        }
        return rtn;
    });
    Polygon.EX_linearMapping.addOverload([Matrix2x2,Polygon,Boolean],function(m,p,f){
        var i=0,
            rtn=new Polygon();
        for(;i<p.nodes.length;++i){
            rtn.add_Node(Vector2.linearMapping(m,p.nodes[i],f));
        }
        return rtn;
    });
    Polygon.EX_linearMapping_nt=Overload_Function.create();
    Polygon.EX_linearMapping_nt.addOverload([Polygon,Matrix2x2,Boolean],function(p,m,f){
        for(var i=p.nodes.length-1;i>=0;--i){
            p.nodes[i].linearMapping(m,true,f);
        }
        return p;
    });
    Polygon.EX_linearMapping_nt.addOverload([Matrix2x2,Polygon,Boolean],function(m,p,f){
        for(var i=p.nodes.length-1;i>=0;--i){
            p.nodes[i].linearMapping(m,false,f);
        }
        return p;
    });
}while(0);

// 贝塞尔曲线部分 大部分数学支持来自于 https://pomax.github.io/bezierinfo/zh-CN/index.html
// 真是强而有力的资料


class Line{
    constructor(op,ed){
        this.op=op;
        this.ed=ed;
        this._tangent=null;
        this._normal=null;
    }
    static copy(tgt){
        return new Line(Vector2.copy(tgt.op),Vector2.copy(tgt.ed));
    }
    copy(){
        return Line.copy(this);
    }
    refresh_Cache(){
        this._tangent=null;
        this._normal=null;
    }
    get_LengthLong(){
        return Math2D.get_LineLength(this.op,this.ed);
    }
    sample(t){
        return Math2D.sample_Line(this.op,this.ed,t);
    }
    get_Tangent(t){
        if(!this._tangent){
            this._tangent=Vector2.dif(this.ed,this.op);
        }
        return this._tangent;
    }
    get_Normal(t){
        if(!this._normal){
            this._normal=this.get_Tangent().copy().linearMapping(Matrix2x2.ROTATE_90).normalize();
            console.log(this,this._normal);
        }
        return this._normal;
    }
    get_t_ByLengthLong(l){
        return l/this.get_LengthLong();
    }
    get_Min(){
        return new Vector2(
            this.op.x<this.ed.x?this.op.x:this.ed.x,
            this.op.y<this.ed.y?this.op.y:this.ed.y,
        )
    }
    get_Max(){
        return new Vector2(
            this.op.x>this.ed.x?this.op.x:this.ed.x,
            this.op.y>this.ed.y?this.op.y:this.ed.y,
        )
    }
}

class PathCommand{
    constructor(){
        /** @type {string} 操作命令 */
        this.command="";
        /** @type {number[]} 控制参数 */
        this.ctrl=[];
        /**@type {Delegate} 修改数据后的委托 */
        this.change_delegate=Delegate.create();

    }
    /** 修改当前命令数据
     * @param {string|pathCommand} data 
     */
    set(data){
        var d;
        if(data.constructor===String){
            d=PathCommand.loadSvgCommand(data).c;
        }else{
            d=data;
        }
        var i=0;
        this.command=d.command;
            i=this.ctrl.length=d.ctrl.length;
            for(--i;i>=0;--i){
                this.ctrl[i]=d.ctrl[i];
            }
        this.change_delegate&&this.change_Delegate(this);
    }
    /** 拷贝函数
     * @param {PathCommand} tgt 
     * @return {PathCommand} 
     */
    static copy(tgt){
        var rtn= new PathCommand();
        rtn.command=tgt.command;
        rtn.ctrl=tgt.ctrl.concat();
        return rtn;
    }
    static commandList="MmLlHhVvZzCcSsQqTtAa"
    /** 读取 svg 的 path 字符串的其中一个命令
     * @param {string} svgStr  SVG 的 Path 格式的字符串
     * @param {number} op  开始读取的下标
     * @return {{c:PathCommand,i:number}} 返回读取的一份指令和下一个指令的起始下标
     */
    static loadSvgCommand(svgStr,op){
        var rtn=new PathCommand();
        var i=op||0,f=false,
            d=i+1,df=false;
        while(svgStr[i]){
            if(f){
                if(PathCommand.commandList.indexOf(svgStr[i])!==-1){
                    if(df){
                        rtn.ctrl.push(parseFloat(svgStr.slice(d,i)));
                    }
                    // 到达下一个控制字符
                    return {c:rtn,i:i};
                }else{
                    // 数字截取
                    if(df){
                        if(!canBeNumberChar(svgStr[i])){
                            rtn.ctrl.push(parseFloat(svgStr.slice(d,i)));
                            df=false;
                        }
                    }
                    else{
                        if(canBeNumberChar(svgStr[i])){
                            d=i;
                            df=true;
                        }
                    }
                }
            }else{
                if(PathCommand.commandList.indexOf(svgStr[i])!==-1){
                    // 得到控制字符
                    rtn.command=svgStr[i];
                    f=true;
                }
            }
            ++i;
        }
        if(df){
            rtn.ctrl.push(parseFloat(svgStr.slice(d,i)));
        }
        return {c:rtn,i:i};
    }
    /** 读取 svg 内的 path 的格式
     * @param {string} svgStr svg 的 路径 格式 字符串
     * @param {PathCommand[]} list 变更的数组的引用
     * @return {PathCommand[]} 返回命令组
     */
    static load_SvgString(svgStr,list){
        var i=0,cmdList=list||[],temp=null,j=0;
        while(svgStr[i]){
            temp=PathCommand.loadSvgCommand(svgStr,i);
            cmdList[j]=temp.c;
            i=temp.i;
            ++j;
        }
        return cmdList;
    }
    /** 计算落点(终点)
     * @param {PathCommand} pathCommand 控制字符
     * @param {Vector2} opPoint 起点(用作相对坐标)
     * @param {Vector2} mPoint  上次的m进入的坐标
     */
    static calc_LandingPoint(pathCommand,opPoint,mPoint){
        if((pathCommand.command==='z')||(pathCommand.command==='Z')){
            return Vector2.copy(mPoint);
        }
        var _opPoint=opPoint||{x:0,y:0};
        var l=pathCommand.ctrl.length-1;
        if(pathCommand.command>='a'&&pathCommand.command<'z'){
            if(pathCommand.command==='h'){
                return new Vector2(_opPoint.x+(pathCommand.ctrl[l]||0),  _opPoint.y);
            }
            if(pathCommand.command==='v'){
                // y坐标移动
                return new Vector2(_opPoint.x,  _opPoint.y+(pathCommand.ctrl[l]||0));
            }
            // 相对坐标
            return Vector2.sum({x:pathCommand.ctrl[l-1]||0,y:pathCommand.ctrl[l]||0},_opPoint);
            
        }else{
            // 绝对坐标
            return new Vector2(pathCommand.ctrl[l-1]||0,pathCommand.ctrl[l]||0);
        }
    }
}

class Path{
    /** 使用 svg 的 path 字符串初始化
     * @param {PathCommand[]} pathStr 和 svg 的 path 的 语法相同
     */
    constructor(command_set){
        /** @type {PathCommand[]} */
        this._command_set=[];
        this.command_set=command_set;
        // onlyRoid
        /** @type {Array} 缓存的数学对象 可能的值有 弧形, 向量, 贝塞尔曲线数学对象 */
        this._math_data=[];
        /** @type {Vector2[]} 缓存落点 */
        this._landing_points=[];
        /** @type {number[]} 弧长查找表 */
        this._length_long_lut=[];
        this._min=null;
        this._max=null;
    }
    static copy(tgt){
        return new Path(Path.bePathCommandSet(tgt));
    }
    copy(){
        return Path.copy(this);
    }
    /** 指令集合 */
    set command_set(val){
        if((val.constructor===String)||(val instanceof String)){
            this._command_set.length=0;
            PathCommand.load_SvgString(val,this._command_set);
        }else if(val instanceof Array){
            var i=val.length;
            this.command_set.length=i;
            for(--i;i>=0;--i){
                this.command_set[i]=PathCommand.copy(val[i]);
            }
        }
        return this.command_set;
    }
    /** 指令集合 */
    get command_set(){
        return this._command_set;
    }
    /** 指令的长度(个数) */
    get command_length(){
        return this._command_set.length;
    }
    /** 获取落点
     * @param {number} index 要获取的落点的 下标
     * @return 
     */
    get_LandingPoint(index){
        if(index<0){
            return Vector2.ZERO_POINT;
        }
        if(index>=this.command_set.length){
            return Vector2.INFINITY;
        }
        var i=index,    //确定落点
            j=index,    //m指令
            cmds=this.command_set,
            landing_points=this._landing_points,
            mf=false,   
            df,
            isCloseFlag=false;
        if(!landing_points[index]){
            if((cmds[j].command==='z')||(cmds[j].command==='Z')){
                mf=true;
                isCloseFlag=true
            }else{
                j=-1;
            }
            df=((cmds[i].command>='a'&&cmds[i].command<'z'&&i>0)&&!landing_points[i]);
            while(df||mf){
                if(df){
                    // 找到上一个能直接确定的落点的下标
                    --i;
                    df=((cmds[i].command>='a'&&cmds[i].command<'z'&&i>0)&&!landing_points[i]);
                }
                if(mf){
                    // 找到上一个m指令的下标
                    --j;
                    if(j<0){
                        break;
                    }
                    mf=!((cmds[j].command==="M")||(cmds[j].command==="m"));
                }
            }
            // if(isCloseFlag){
            //     // z 指令, 使用上一个 m 指令来得到落点
            //     landing_points[index]=this.get_LandingPoint(j);
            // }else{
            //     // 普通指令, 用上一个已知的坐标或绝对坐标得到落点
                do{
                    landing_points[i]=PathCommand.calc_LandingPoint(this.command_set[i],landing_points[i-1],this.get_LandingPoint(j));
                    ++i;
                }while(i<=index);
            // }
        }
        return landing_points[index];
    }
    /** 取创建数学对象
     * @param {number} index  指令的下标
     * @return {Vector2|Line|Data_Arc__Ellipse|BezierCurve}
     */
    get_MathData(index){
        if(!this._math_data[index]){
            this._math_data[index]=this.create_MathData(index);
        }
        return this._math_data[index];
    }

    // 用于创建数学对象使用的关键字集合
        static _vector2_c="Mm";
        static _line_c="LlHhVvZz";
        static _arc_c="Aa";
        static _bezier_c="CcQq";
        static _bezier_c__t="Tt";
        static _bezier_c__s="Ss";
        static _bezier_c__c3="CcSs";
        static _bezier_c__c2="TtQq";
    // 
    /** 创建数学对象
     * @param {number} index 基于下标创建数学对象
     * @return {Vector2|Line|Data_Arc__Ellipse|BezierCurve}
     */
    create_MathData(index){
        if(!this.command_set[index]){
            throw new Error("Parameter index is out of range!");
        }
        var c=this.command_set[index].command,
            d=this.command_set[index].ctrl;
        var last_lp,now_lp;
        var low_FN=0; //low or up flag number 可以使用 low_FN%2===0判断是否是大写字母
        now_lp=this.get_LandingPoint(index);
        last_lp=this.get_LandingPoint(index-1);        
        // m点
        if(!((low_FN=Path._vector2_c.indexOf(c))===-1)){
            return now_lp;
        }
        // 直线
        if(!((low_FN=Path._line_c.indexOf(c))===-1)){
            return new Line(last_lp,now_lp);
        }
        // 弧线
        if(!((low_FN=Path._arc_c.indexOf(c))===-1)){
            var rx=d[0],
                ry=d[1],
                rotate_angle=-d[2]*deg,
                large_arc_flag=d[3],
                sweep_flag=d[4];
            return Data_Arc__Ellipse.create_ByEndPointRadiusRotate(last_lp,now_lp,rx,ry,rotate_angle,large_arc_flag,sweep_flag);
        }

        // 贝塞尔曲线 op
        var temp_arr=[],i=0,k=0;
        temp_arr.push(last_lp);
        
        // 简化二阶曲线
        var last_cmd=this.command_set[index-1];
        /**@type {BezierCurve} 上一个曲线数学对象*/
        var last_mathData=null;
        var proxy_v=null,
            can_use_last=false,
            is_simple=false,
            l=0;
        // 简化三阶曲线
        if(!((low_FN=Path._bezier_c__s.indexOf(c))===-1)){
            is_simple=true;
            can_use_last=(last_cmd&&(Path._bezier_c__c3.indexOf(last_cmd.command)!==-1));
        }
        // 简化二阶曲线
        else if(!((low_FN=Path._bezier_c__t.indexOf(c))===-1)){
            is_simple=true;
            can_use_last=(last_cmd&&(Path._bezier_c__c2.indexOf(last_cmd.command)!==-1));
        }
        if(is_simple){
            if(can_use_last){
                last_mathData=this.get_MathData(index-1);
                l=last_mathData.points.length-1;
                proxy_v=Math2D.sample_Line(last_mathData.points[l-1],last_mathData.points[l],2);
                            }else{
                proxy_v=last_lp;
            }
            temp_arr.push(proxy_v);
    
            k=temp_arr.push(new Vector2(d[i],d[i+1]))-1;
            if(low_FN>>1<<1!==low_FN){
                temp_arr[k].translate(last_lp);
            }
            temp_arr.push(now_lp);
        }

        // 完整曲线命令
        if(!((low_FN=Path._bezier_c.indexOf(c))===-1)){
            do{
                k=temp_arr.push(new Vector2(d[i],d[i+1]))-1;
                if(low_FN>>1<<1!==low_FN){
                    // 相对to世界
                    temp_arr[k].translate(last_lp);
                }
                i+=2;
            }while(d[i]);
        }

        return new BezierCurve(temp_arr);
        // 贝塞尔曲线 ed

    }
    /** 插入一段指令
     * @param {number} index 插入的下标
     * @param {pathCommand} command 
     */
    insert_Command(index,command){
        var temp=Path.bePathCommandSet(command);
        this._command_set.insertList(index,temp);
        this._callback_CmdInsert__ToMathAndPoint(index,1);
    }
    /** 修改一条指令
     * @param {number} index 要修改的下标
     * @param {pathCommand} command 指令
     */
    set_Command(index,command){
        this._command_set[index].set(command);
        this._callback_CmdUpdate__ToMathAndPoint(index);
    }
    /** 追加一条指令
     * @param {pathCommand} command 
     */
    add_Command(command){
        var l=this._command_set.length;
        this.insert_Command(l,command);
    }
    /** 移除一条指令
     * @param {number} index  下标
     */
    remove_Command(index){
        this._command_set.splice(index,1);
        this._callback_Cmdremove__ToMathAndPoint(index);
    }
    /** 读取一段指令
     * @param {number} index 下标
     */
    get_Command(index){
        return  this._command_set[index];
    }
    /** 转换成path指令集
     * @param {string|PathCommand|PathCommand[]|Path} svg_path_data 原数据来源
     * @return 
     */
    static bePathCommandSet(svg_path_data){
        var temp;
        if(svg_path_data.constructor===String){
            return PathCommand.load_SvgString(svg_path_data);
        }else if(svg_path_data instanceof Array){
            return svg_path_data;
        }else if(svg_path_data._command_set){
            temp=Path.copy(svg_path_data);
            return temp._command_set;
        }else if(svg_path_data.command){
            return [svg_path_data]
        }
    }
    /** 使用index清除缓存的落点和数学对象 如果是后继是相对坐标, 将会继续清理
     * @param {number}} index 开始计算的下标
     */
    clear_PointMath__ByIndex(index,m_flag){
        var cmds=this.command_set,
            i=index,
            d=cmds[i],
            mf=m_flag;

        if(!d){
            return index;
        }
        while(d&&(d.command>='a'&&d.command<'z')){
            if(d.command==='m'){
                mf=true;
            }
            this._landing_points[i]=null;
            this._math_data[i]=null;
            ++i;
            d=cmds[i];
        }
        this._math_data[i]=null;
        while(mf&&d){
            if((d.command==='m')||(d.command==='M')){
                mf=false;
            }
            if((d.command==='Z')||(d.command==='z')){
                this._math_data[i]=null;
                this._math_data[i+1]=null;
                i=this.clear_PointMath__ByIndex(i);
                
            }
            ++i;
            d=cmds[i];
        }
        // 清理aabb坐标
        this._min=null;
        this._max=null;
        return i;
    }
    /** 指令修改后的回调 清理需要相对坐标的缓存内容 
     * @param {number} index  修改的下标
     */
    _callback_CmdUpdate__ToMathAndPoint(index){
        this.clear_PointMath__ByIndex(index);
    }
    /** 移除指令后的回调 清理需要相对坐标的缓存内容 
     * @param {number} index  修改的下标
     * @param {Boolean} 移除的指令是否是m指令
     */
    _callback_Cmdremove__ToMathAndPoint(index,m_flag){
        var cmds=this.command_set,
            i=index,
            d=cmds[i];
        this._landing_points.splice(index,1);
        this._math_data.splice(index,1);
        this.clear_PointMath__ByIndex(index,m_flag);
        this._math_data[i]=null;
    }
    /** 插入指令后的回调 清理需要相对坐标的缓存内容 
     * @param {number} index  修改的下标
     * @param {number} length 插入的长度
     */
    _callback_CmdInsert__ToMathAndPoint(index,length){
        var cmds=this.command_set,
            l=length,
            i=index,
            mf=false;
        this._landing_points.splice(index,0,new Array(length));
        this._math_data.splice(index,0,new Array(length));
        for(l;l>0;--l){
            this._landing_points[i]=null;
            this._math_data[i]=null;
            if((!mf)&&((cmds[i].command==='m')||(cmds[i].command==='M'))){
                mf=true;
            }
            ++i;
        }
        this.clear_PointMath__ByIndex(i,mf);
    }

    /** 刷新/清理 缓存
     */
    refresh_Cache(){
        this._landing_points.length=0;
        this._math_data.length=0;
        this._length_long_lut.length=0;
        this._min=null;
        this._max=null;
    }
    /** 获取路径总长度
     * @return {number} 路径总长度
     */
    get_LengthLong(){
        return this.length_long_lut[this.command_length-1];
    }
    /** @type {number[]} 长度显式查找表*/
    get length_long_lut(){
        if(this._length_long_lut.length!==this.command_length){
            this._length_long_lut.length=0;
            var i,temp,
                l=this.command_length,
                _length_long=0;
            for(i=0;i<l;++i){
                temp=this.get_MathData(i);
                if(temp.get_lengthLong){
                    _length_long+=temp.get_LengthLong();
                    this._length_long_lut.push(_length_long);
                }else{
                    this._length_long_lut.push(_length_long);
                }
            }
        }
        return this._length_long_lut;
    }
    
    /** 采样点
     * @param {number} t 时间参数t
     * @return {Vector2} 返回采样的坐标
     */
    sample(t){
        var l=t*this.get_LengthLong(),
            ti=this.get_ti_ByLengthLong(l),
            temp=this.get_MathData(ti.i);
        return temp.sample(ti.t);
    }
    /** 使用长度求当前t值
     * @param {number} l Length Long
     * @return {{t:number,i:number}}  t为当前数学对象的t参数, i是指令(数学对线)的下标
     */
    get_ti_ByLengthLong(l){
        var _t,
            temp;
        if(l<0){
            l+=this.get_LengthLong();
        }
        var i=select_Lut__Binary(this.length_long_lut,l);
        temp=this.get_MathData(i);
        _t=temp.get_t_ByLengthLong(l-this.length_long_lut[i-1]);
        
        return {
            t:_t,
            i:i
        }
    }
    /** 当前点的法线
     * @param {number} 时间参数 t
     * @return {Vector2} 返回一个 pt 的相对坐标 请自行修改模长或进行标准化
     */
    get_Normal(t){
        var l=t*this.get_LengthLong(),
            ti=this.get_ti_ByLengthLong(l),
            temp=this.get_MathData(ti.i);
        return temp.get_Normal(ti.t);
    }
    /** 当前点的方向
     * @param {number} 时间参数 t
     * @return {Vector2} 返回一个 pt 的相对坐标 请自行修改模长或进行标准化
     */
    get_Tangent(t){
        var l=t*this.get_LengthLong(),
            ti=this.get_ti_ByLengthLong(l),
            temp=this.get_MathData(ti.i);
        return temp.get_Tangent(ti.t);
    }

    get_MinAmax(){
        var i=this.command_length-1,
            min,t_min,
            max,t_max,
            temp_math;
            
        do{
            temp_math=this.get_MathData(i);
            if(temp_math instanceof Vector2){
                continue;
            }
            min=temp_math.get_Min();
            max=temp_math.get_Max();
        }while((--i>=0)&&(!max));
        
        for(;i>=0;--i){
            temp_math=this.get_MathData(i);
            if(temp_math instanceof Vector2){
                continue;
            }
            t_min=temp_math.get_Min();
            t_max=temp_math.get_Max();

            if(t_min.x<min.x)min.x=t_min.x;
            if(t_min.y<min.y)min.y=t_min.y;

            if(t_max.x>max.x)max.x=t_max.x;
            if(t_max.y>max.y)max.y=t_max.y;
        }
        return {
            min:min,
            max:max
        };
    }
    get_Min(){
        if(!this._max){
            var mm=this.get_MinAmax();
            this._max=mm.max;
            this._min=mm.min;  
        }
        return this._min;
    }
    get_Max(){
        if(!this._max){
            var mm=this.get_MinAmax();
            this._max=mm.max;
            this._min=mm.min;  
        }
        return this._max;
    }

    /** 判断某点是否在内部
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @return {boolean} 返回是否在内部
     */
    is_Inside(x,y){ 
        var i=0,j,k,
            l=this.command_length,
            rtn=0;
        /**@type {Vector2 | Line | Data_Arc__Ellipse | BezierCurve} */
        var temp;
        // 射线穿过曲线
        for(;i<l;++i){
            temp=this.get_MathData(i);
            if(temp instanceof Line){
                rtn+=Math2D.get_intersectionOfXRadialLine_Fn(x,y,temp.op,temp.ed)
                continue;
            }
            if(temp instanceof BezierCurve){
                rtn+=(k=Math2D.get_intersectionOfXRadialBezier_n(x,y,temp));
                if(k===-1)return true;
                continue;
            }
            if(temp instanceof Vector2){
                continue;
            }
            if(temp instanceof Data_Arc__Ellipse){
                var temp1=temp.bezier_curve_proxy;
                for(j=temp1.length-1;j>=0;--j){
                    rtn+=(k=Math2D.get_intersectionOfXRadialBezier_n(x,y,temp1[j]));
                    if(k===-1)return true;
                }
                continue;
            }
        }
        return !!(rtn%2);
    }
}

export{
    Math2D,
    Data_Rect,
    Data_Arc,
    Data_Arc__Ellipse,
    Data_Sector,
    Vector2,
    Matrix2x2,
    Matrix2x2T,
    matrixToCSS,
    MatrixController,
    MatrixController__matrix,
    MatrixController__rotate,
    MatrixController__translate,
    MatrixController__horizontal,
    MatrixController__shear,
    MatrixController__scale,
    Polygon,
    BezierCurve,
    PathCommand,
    Line,
    Path,
}
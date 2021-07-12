import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { isTriangle as isisTri, judgeTriPos, randInt } from "./algorithms";
import { colors } from "./constants";
import "./style.css";

// 声明"点" (Point) 的数据类型
export type Point = {
  name: string;
  x: number;
  y: number;
};

const letterArr = ["a", "b", "c", "d", "e", "f"];
const initData = letterArr.map((v) => ({ name: v, x: 0, y: 0 }));

const App: React.FC = () => {
  const [points, setPoints] = useState<Point[]>(initData);
  const [isTriangles, setIsTriangle] = useState<boolean[]>([false, false]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 处理数字输入与改变
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    pos: 0 | 1
  ) => {
    const val = Number(e.target.value);

    const mapFn = (obj: Point, i: number) => {
      let point = obj;

      if (i === index) {
        const x = pos ? obj.x : val;
        const y = pos ? val : obj.y;
        point = { ...obj, x, y };
      }

      return point;
    };

    setPoints(points.map(mapFn));
  };

  // 点坐标格式化展示函数
  const display = (v: Point) => `${v.name} (${v.x}, ${v.y}), `;

  // 清空点坐标数据
  const clear = () => setPoints(initData);

  // 在画板范围内随机生成点坐标
  const random = () => {
    const mapFn = (v: string) => {
      const x = randInt(0, 1300);
      const y = randInt(0, 540);
      return { name: v, x, y };
    };

    setPoints(letterArr.map(mapFn));
  };

  // 当点 (Points) 坐标数据改变时执行
  useEffect(() => {
    // 判断三角形是否能组成三角形并赋给triRes数组变量
    const triRes = [isisTri(points.slice(0, 3)), isisTri(points.slice(3, 6))];
    setIsTriangle(triRes);

    // 获取画板DOM元素
    let canvas = canvasRef.current;

    if (canvas) {
      // 获取二位画板上下文
      const ctx = canvas.getContext("2d");
      const height = canvas.height;

      canvas.style.border = "2px solid #ccc"; // 设置边框
      canvas.height = height; // 清空画板, (当画板高度修改时内容会被清空)

      if (ctx) {
        // 截取三角形点的坐标
        const tri1 = points.slice(0, 3);
        const tri2 = points.slice(3, 6);

        // 设置画笔
        ctx.lineWidth = 2.4;
        ctx.font = "24px sans-serif";
        ctx.fillStyle = colors.primary;

        // 绘制第一个三角形
        ctx.beginPath();
        ctx.strokeStyle = colors.green;
        ctx.moveTo(points[2].x, points[2].y);
        tri1.forEach((_, i) => ctx.lineTo(points[i].x, points[i].y));
        ctx.closePath();
        ctx.stroke();

        // 绘制第二个三角形
        ctx.beginPath();
        ctx.strokeStyle = colors.orange;
        ctx.moveTo(points[5].x, points[5].y);
        tri2.forEach((_, i) => ctx.lineTo(points[i + 3].x, points[i + 3].y));
        ctx.closePath();
        ctx.stroke();

        // 绘制字母
        letterArr.forEach((v, i) => ctx.fillText(v, points[i].x, points[i].y));
      }
    }
  }, [points]);

  const inputProps = { type: "number", step: "10", min: "0" };

  // 渲染网页结构
  return (
    <div className="root">
      <h1>三角形相对位置判定</h1>
      <p>请输入三角形A与B的三点坐标值</p>
      <div>
        {initData.map((obj, index) => (
          <div key={index} className="input-wrapper">
            <div>[ {obj.name} ]</div>
            <span>x :</span>
            <input
              {...inputProps}
              max="1300"
              onChange={(e) => handleChange(e, index, 0)}
              value={points[index].x}
            />
            <span>y :</span>
            <input
              {...inputProps}
              max="540"
              onChange={(e) => handleChange(e, index, 1)}
              value={points[index].y}
            />
          </div>
        ))}
      </div>
      <div>
        <button onClick={clear}>❎清空</button>
        <button onClick={random}>🔄随机</button>
        两三角形相对位置关系:<span>{judgeTriPos(points)}</span>
      </div>
      <p>
        三角形A: {points.slice(0, 3).map(display)}
        <span>{` ${isTriangles[0] ? "能" : "不能"}`}</span>构成三角形
      </p>
      <p>
        三角形B: {points.slice(3, 6).map(display)}
        <span>{` ${isTriangles[1] ? "能" : "不能"}`}</span>构成三角形
      </p>
      <br />
      <div>
        <canvas ref={canvasRef} height="540px" width="1300px" />
      </div>
    </div>
  );
};

export default App;

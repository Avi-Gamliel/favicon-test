import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { BsFillTrash2Fill, BsCircleFill, BsFillSquareFill, BsBrush } from 'react-icons/bs';
import { BiMinus, BiEraser, BiVector } from 'react-icons/bi';
import { IoIosUndo, IoMdArrowDropdown } from 'react-icons/io';
import { GiArrowCursor } from 'react-icons/gi';
// import BG from './bg.jpg'
import './App.css';

const TYPES = ["128x128", "64x64", "32x32"]
const CODEC = ['png', 'jpeg', 'jpg', 'ico']
const CANVAS_WIDTH = 300;
const COLOR_PALLETE = {
  blue: '#007bff'
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
const arrowBox = (val) => {
  return document.body.style.cursor = `${val}-resize`
}
const moveAllUp = (array, i) => {
  const temp = array[i]
  const slice = array.slice(0, i)
  const sec = array.slice(i, array.length)
  sec.shift()
  // array.shift()
  console.log(temp, slice, sec)
  return [...slice, ...sec, temp]

}

const Option = ({ val, setVal, setToggle }) => {
  return (
    <div
      className="options"
      style={{ height: 40 }}
      onClick={() => {
        setVal(val)
        setToggle(false)
      }}>
      {val}
    </div>
  )
}

const Select = ({ data, value, setValue, id }) => {
  const [toggle, setToggle] = useState(false)
  useEffect(() => {
    const cickEvent = (e) => {
      console.log(e.target.className, id);
      if (e.target.className !== 'options-' + id) {
        setToggle(false)
      }
    }
    document.addEventListener('click', cickEvent)
    return () => {
      document.removeEventListener('click', cickEvent)
    }
  }, [id])
  return (
    <div
      className={`options-${id}`}
      style={{ marginRight: 5, marginLeft: 5 }}>
      <div
        className={`options-${id}`}

        onClick={() => setToggle(prev => !prev)}
        style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 5, paddingRight: 5, width: 100, height: 30 }}>{value}<IoMdArrowDropdown color='black' size={25} /></div>
      {toggle &&
        <div
          className={`options-${id}`}

          style={{ position: 'absolute', boxShadow: '0px 10px 12px 2px rgba(0,0,0,0.3)', paddingTop: 5, paddingRight: 5, paddingLeft: 5, width: 100, background: 'white', display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          {data.map((d, i) => <Option setVal={setValue} setToggle={setToggle} val={d} key={i} index={i} />)}
        </div>
      }
    </div>

  )
}

const NavBar = ({ navRef, undo, fillColorRef, fillColor, setFillColor, setType, type, codec, resolution, setResolution, setCodec, clearRect, setColor, colorRef, color, ctx, bgColor, setBgColor, setSize, size }) => {

  const onErase = (ctx) => {
    setType('erase')
    setColor(colorRef.current.value)
    ctx.current.globalCompositeOperation = 'destination-out'
    setColor('#FFF')
  }


  return (
    <div className='nav-bar-container' ref={navRef}>
      <div className='full-flex'>
        <div className={type == 'undo' ? 'icon-choose' : 'box-icon'}>  <IoIosUndo color={type == 'undo' ? '#007bff' : 'grey'} size={20} className='icon' onClick={() => {
          undo()
          setType('undo')
        }} />    </div>

        <div className={type == 'move' ? 'icon-choose' : 'box-icon'}> <GiArrowCursor size={20} color={type == 'move' && COLOR_PALLETE.blue} className='icon' onClick={() => setType('move')} /></div>
        <div className={type == '' ? 'icon-choose' : 'box-icon'}> <BsFillTrash2Fill size={20} color={type == '' && COLOR_PALLETE.blue} className='icon' onClick={() => clearRect()} /></div>
        <div className={type == '' ? 'icon-choose' : 'box-icon'}> <BiEraser size={20} color={type == '' && COLOR_PALLETE.blue} className='icon' onClick={(e) => onErase(ctx)} /></div>
        <div className={type == 'connect' ? 'icon-choose' : 'box-icon'}> <BiVector size={20} color={type == 'connect' && COLOR_PALLETE.blue} className='icon' onClick={() => setType('connect')} /></div>
        <div className={type == 'rect' ? 'icon-choose' : 'box-icon'}> <BsFillSquareFill size={20} color={type == 'rect' && COLOR_PALLETE.blue} className='icon' onClick={() => setType('rect')} /></div>
        <div className={type == 'circle' ? 'icon-choose' : 'box-icon'}> <BsCircleFill size={20} color={type == 'circle' && COLOR_PALLETE.blue} className='icon' onClick={() => setType('circle')} /></div>
        <div className={type == 'stroke' ? 'icon-choose' : 'box-icon'}> <BiMinus size={35} color={type == 'stroke' && COLOR_PALLETE.blue} className='icon stroke' onClick={() => setType('stroke')} /></div>
        <div className={type == 'brush' ? 'icon-choose' : 'box-icon'}> <BsBrush onClick={() => setType('brush')} color={type == 'brush' && COLOR_PALLETE.blue} size={20} className='icon' /></div>
      </div>
      <div className='full-flex'>
        <Select id={0} data={TYPES} setValue={setResolution} value={resolution} />
        <Select id={1} data={CODEC} setValue={setCodec} value={codec} />

        <input type="color"
          className="color-picker"
          ref={colorRef}
          value={bgColor} onChangeCapture={(e) => setBgColor(prev => e.target.value)} />
        <h3 className='logo'>FV</h3>

      </div>
      {type !== 'move' ?
        <div className='box-tool'>
          <div className='tool-row'>

            <label htmlFor='stroke-size'>STROKE SIZE: </label>
            <input
              id='slider' type="range" min="0" max="50"
              className="slider"
              defaultValue={size}
              onChange={(e) => setSize(e.target.value)}
              onMouseUp={(e) => setSize(e.target.value)}
            />

          </div>
          {type !== 'erase' &&
            <div className='tool-row'>
              <>
                <label htmlFor='stroke-color'>STROKE: </label>
                <input
                  type='color'
                  className="color-picker"
                  ref={colorRef}
                  value={color} onChangeCapture={(e) => setColor(e.target.value)}
                  colorformat="rgba"
                />
              </>
              {type !== 'brush' ? type !== 'stroke' ?
                <>
                  <label htmlFor='fill-color'>FILL: </label>
                  <input
                    type='color'
                    className="color-picker"
                    ref={fillColorRef}
                    value={fillColor}
                    onChangeCapture={(e) => setFillColor(e.target.value)}
                  />
                </> : null : null}
            </div>
          }
        </div> : null
      }
    </div>
  )
}
const BoxTools = ({path, setPaths}) => {
  console.log(path);
  const [size, setSize] = useState(path.size)
  const [fillColor, setFillColor] = useState(path.fill)
  const [color, setColor] = useState(path.color)
  const colorRef = useRef()
  const fillColorRef = useRef()

useEffect(() => {
  setPaths(prev=>{
    prev[prev.length -1].color = color;
    prev[prev.length -1].fill = fillColor;
    prev[prev.length -1].size = size;
   return [...prev] 
  })
}, [color, fillColor,size])
  
  return (
    <div className='box-tool'>
      <div className='tool-row'>

        <label htmlFor='stroke-size'>STROKE SIZE: </label>
        <input
          id='slider' type="range" min="0" max="50"
          className="slider"
          defaultValue={size}
          onChange={(e) => setSize(e.target.value)}
          onMouseUp={(e) => setSize(e.target.value)}
        />

      </div>
      <div className='tool-row'>
        <>
          <label htmlFor='stroke-color'>STROKE: </label>
          <input
            type='color'
            className="color-picker"
            ref={colorRef}
            value={color} onChangeCapture={(e) => setColor(e.target.value)}
            colorformat="rgba"
          />
        </>
        <>
          <label htmlFor='fill-color'>FILL: </label>
          <input
            type='color'
            className="color-picker"
            ref={fillColorRef}
            value={fillColor}
            onChangeCapture={(e) => setFillColor(e.target.value)}
          />
        </>
      </div>
    </div>
  )
}
function App() {
  const colorRef = useRef()
  const canvasRef = useRef()
  const height = window.innerHeight
  const width = window.innerWidth
  const [paths, setPaths] = useState([])
  const [type, setType] = useState('brush')
  const [color, setColor] = useState('#252525')
  const [fillColor, setFillColor] = useState('#dbdbdb')
  const fillColorRef = useRef()
  const [size, setSize] = useState(10)
  const [drawing, setDrawing] = useState()
  const [bgColor, setBgColor] = useState('#fafafa')
  const [keyCode, setKeyCode] = useState([])
  const [idChoose, setIdChoose] = useState(null)
  // const [boxTools, setBoxTools] = useState(null)
  const [last, setLast] = useState({
    x: width / 2,
    y: height / 2
  })
  const ctx = useRef()
  const navRef = useRef()
  const [codec, setCodec] = useState('jpeg')
  const [resolution, setResolution] = useState('32x32')
  const [selects, setSelect] = useState([])
  const lastPos = useRef()
  useLayoutEffect(() => {

    const canvas = canvasRef.current;
    canvas.width = 300; canvas.height = 300;
    ctx.current = canvas.getContext('2d');
    redraw();

  }, []);


  const makeRect = (element, path) => {
    element.strokeStyle = path.color
    element.fillStyle = path.fill
    element.lineWidth = path.size
    ctx.current.beginPath()
    element.fillRect(path.pos[0].x1, path.pos[0].y1, path.pos[0].x2 - path.pos[0].x1, path.pos[0].y2 - path.pos[0].y1);
    element.strokeRect(path.pos[0].x1, path.pos[0].y1, path.pos[0].x2 - path.pos[0].x1, path.pos[0].y2 - path.pos[0].y1)
    element.stroke();
    element.closePath()
  }

  const makeCircle = (element, path) => {
    element.strokeStyle = path.color
    const X1 = path.pos[0].x1;
    const X2 = path.pos[0].x2;
    const Y1 = path.pos[0].y1;
    const Y2 = path.pos[0].y2;
    const subtractXs = X2 - X1;
    const subtractYs = Y2 - Y1;
    element.fillStyle = path.fill
    element.lineWidth = path.size
    ctx.current.beginPath()
    element.ellipse(X1 + ((subtractXs) / 4),
      Y1 + ((subtractYs) / 4),
      subtractXs < 0 ? -1 * (subtractXs) : (subtractXs),
      subtractYs < 0 ? -1 * (subtractYs) : (subtractYs), 0, 0, 2 * Math.PI);
    element.stroke()
    element.fill();
    element.closePath()
  }

  const makeStroke = (element, path) => {
    ctx.current.beginPath()
    element.strokeStyle = path.color
    element.lineWidth = path.size
    element.moveTo(path.pos[0].x1, path.pos[0].y1)
    element.lineTo(path.pos[0].x2, path.pos[0].y2)
    element.stroke();
    element.closePath()
  }

  const makePath = (element, path) => {
    ctx.current.beginPath()
    for (let i = 0; i < path.pos.length - 1; i++) {
      if (path.pos[i + 1] !== undefined) {
        element.strokeStyle = path.color
        element.lineWidth = path.size
        element.moveTo(path.pos[i].x, path.pos[i].y)
        element.lineTo(path.pos[i + 1].x, path.pos[i + 1].y)
        element.stroke()
      }
    }
    element.closePath()
  }


  const makeConnectLine = (element, path) => {
    element.beginPath();
    element.moveTo(path.pos[0].x, path.pos[0].y)
    for (let i = 0; i < path.pos.length - 1; i++) {
      if (path.pos[i + 1] !== undefined) {
        element.strokeStyle = path.color
        element.fillStyle = path.fill
        element.lineWidth = path.size
        element.lineTo(path.pos[i].x, path.pos[i].y)
        element.lineTo(path.pos[i + 1].x, path.pos[i + 1].y)
        element.fill();
        element.stroke()
      }
    }
    element.closePath()
  }

  const onPaint = () => {
    ctx.current.globalCompositeOperation = 'source-over'
  }

  function findDistance(x1, x2, y1, y2) {
    const Distance = Math.sqrt((Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)))
    return Distance

  }

  const mouseOver = (e) => {
    let lastX = e.offsetX || (e.pageX - canvasRef.current.offsetLeft)
    let lastY = e.ostartX || (e.pageY - canvasRef.current.offsetTop);
  }
  const startDrawing = (e) => {
    e.preventDefault()
    e.stopPropagation()

    let lastX = e.offsetX || (e.pageX - canvasRef.current.offsetLeft)
    let lastY = e.ostartX || (e.pageY - canvasRef.current.offsetTop);
    lastPos.current = { startX: lastX, startY: lastY, endX: lastX, endY: lastY }
    setLast(prev => {
      prev.x = lastX
      prev.y = lastY
      return prev
    })
    // setPaths(prev => [...prev, { id: paths.length, color: color, type: type, size: size, pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }] }])

    // var position = ctx.current.transformedPoint(lastX, lastY);
    setDrawing(true)
    if (type === 'brush') {
      setPaths(prev => [...prev,
      {
        id: paths.length,
        color: color,
        type: type,
        size: size,
        pos: [{ x: lastX, y: lastY }],
        choose: false
      }])
    } else if (type === 'move') {
      console.log(327, lastX, lastY)
      // find paths in range; 
      paths.forEach((p, i) => {
        console.log(p);
        if (lastX > (p.pos[0].x1 || p.pos[0].x) &&
          lastX < (p.pos[0].x2 || p.pos[0].x) &&
          lastY > (p.pos[0].y1 || p.pos[0].y) &&
          lastY < (p.pos[0].y2 || p.pos[0].y)
        ) {
          console.log('asddddddddddddddddd');
          setSelect([{
            id: 'select',
            color: COLOR_PALLETE.blue,
            type: type,
            size: 4,
            fill: 'rgba(0,0,0,0)',
            pos: [{ x1: p.pos[0].x1 - (p.size / 2), y1: p.pos[0].y1 - (p.size / 2), x2: p.pos[0].x2 + (p.size / 2), y2: p.pos[0].y2 + (p.size / 2) }],
            choose: false

          }])
          setPaths(prev => {
            prev.forEach((p, j) => {
              if (i == j) {
                p.choose = true
              } else {
                p.choose = false
              }
            })
            // prev[i].choose = true;
            prev = moveAllUp(prev, i)
            return [...prev];
          })

          setIdChoose(i)
        }
        //   console.log('p.pos.x', (p.pos[0].x1 || p.pos[0].x))
      })
    } else if (type === 'eraser') {

    } else if (type === 'rect') {
      setPaths(prev => [...prev,
      {
        id: paths.length,
        color: color,
        type: type,
        size: size,
        fill: fillColor,
        pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }],
        choose: false

      }])

    } else if (type === 'circle') {
      setPaths((prev) => [...prev,
      {
        id: paths.length,
        color: color,
        fill: fillColor,
        type: type,
        size: size,
        pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }]
      }])
    } else if (type === 'stroke') {
      setPaths(prev => [...prev,
      {
        id: paths.length,
        color: color,
        type: type,
        size: size,
        pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }],
        choose: false

      }])
    } else if (type === 'connect') {
      // console.log('connect');
      // console.log(233, paths);
      if (paths.length > 0) {
        // console.log('connect  =  paths exist');

        if (paths[paths.length - 1].type !== 'connect') {
          // console.log("connect  =  paths exist : the last type is'nt connect");

          setPaths(prev => [...prev,
          {
            id: paths.length,
            color: color,
            fill: fillColor,
            type: type,
            size: size,
            // pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }]
            pos: [{ x: lastX, y: lastY }],
            choose: false


          }])
        } else {
          // console.log("connect  =  paths exist : the last type is connect");
          const index = paths.length - 1;
          const POS = paths[index].pos;
          const LENGTH = POS.length;
          const LAST = LENGTH - 1;
          // console.log(fillColor);


          const tgb = hexToRgb(fillColor)
          // console.log(tgb);
          if (POS[LAST].x === POS[0].x &&
            POS[LAST].y === POS[0].y && LENGTH !== 1) {
            setPaths(prev => [...prev, {
              id: paths.length,
              color: color,
              fill: fillColor,
              type: type,
              size: size,
              pos: [{ x: lastX, y: lastY }],
              choose: false

            }])
          } else {


            setPaths(prev => {
              // console.log('state ', prev[index].pos);
              // prev[index].pos.push({ x1: lastX, y1: lastY, x2: lastX, y2: lastY })
              const temp = prev[prev.length - 1].pos
              // prev[prev.length - 1].pos = [...temp,{ x1: temp[temp.length-1].x2, y1:temp[temp.length-1].y2, x2: lastX, y2: lastY }]
              prev[prev.length - 1].pos = [...temp, { x: lastX, y: lastY }]

              return [...prev]
            })
          }
        }
      } else {
        // console.log("connect  =  paths empty");

        setPaths(prev => [
          {
            id: paths.length,
            color: color,
            fill: fillColor,
            type: type,
            size: size,
            pos: [{ x: lastX, y: lastY }],
            choose: false

            // pos: [{ x1: lastX, y1: lastY, x2: lastX, y2: lastY }]

          }])
      }

    }
  }

  const onDraw = (evt) => {
    const lastX = evt.offsetX || (evt.pageX - canvasRef.current.offsetLeft);
    const lastY = evt.offsetY || (evt.pageY - canvasRef.current.offsetTop);
    setLast(prev => {
      prev.x = lastX
      prev.y = lastY
      return prev
    })
    let XR, XL, YT, YB, rangX, rangY
    if (selects.length > 0) {
      const selectPos = selects[0].pos[0]
      XR = (selectPos.x2 + 20 > lastX && selectPos.x2 - 20 < lastX)
      YT = (selectPos.y1 + 20 > lastY && selectPos.y1 - 20 < lastY)
      XL = (selectPos.x1 + 20 > lastX && selectPos.x1 - 20 < lastX)
      YB = (selectPos.y2 + 20 > lastY && selectPos.y2 - 20 < lastY)
      rangX = (selectPos.x1 < lastX && selectPos.x2 > lastX);
      rangY = (selectPos.y2 > lastY && selectPos.y1 < lastY);
      if (XR && YT) { // top right
        arrowBox('ne')
      } else if (XR && YB) { // bottom right
        arrowBox('se')
      } else if (XL && YT) { // top left
        arrowBox('se')
      } else if (XL && YB) { // bottom left
        arrowBox('ne')
      } else if (XR && rangY) { // right
        arrowBox('e')
      } else if (XL && rangY) { // lefft
        arrowBox('e')
      } else if (rangX && YB) { // bottom
        arrowBox('n')
      } else if (rangX && YT) { // top
        arrowBox('n')
      } else {
        document.body.style.cursor = 'auto'
      }
    }
    if (!drawing) return;
    lastPos.current.startX = last.x
    lastPos.current.startY = last.y
    lastPos.current.endX = lastX
    lastPos.current.endY = lastY

    const DX = lastPos.current.endX - lastPos.current.startX
    const DY = lastPos.current.endY - lastPos.current.startY


    if (selects.length > 0) {
      if (type === 'move') {

        //loop all the object 

        const { x1, y1, x2, y2 } = paths[idChoose].pos[0]
        const CDx = lastPos.current.startX - x1
        const CDy = lastPos.current.startY - y1
        if (XR && YT) { // top right
          console.log('right top tuch ');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x2 += DX / 2
            prev[prev.length - 1].pos[0].y1 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x2 += DX / 2
            prev[0].pos[0].y1 += DY / 2

            return [...prev]
          })
        } else if (XR && YB) { // bottom right
          console.log('right bottom tuch ');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x2 += DX / 2
            prev[prev.length - 1].pos[0].y2 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x2 += DX / 2
            prev[0].pos[0].y2 += DY / 2

            return [...prev]
          })
        } else if (XL && YT) { // top left
          console.log('left top tuch ');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x1 += DX / 2
            prev[prev.length - 1].pos[0].y1 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x1 += DX / 2
            prev[0].pos[0].y1 += DY / 2

            return [...prev]
          })
        } else if (XL && YB) { // bottom left
          console.log('left bottom tuch ');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x1 += DX / 2
            prev[prev.length - 1].pos[0].y2 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x1 += DX / 2
            prev[0].pos[0].y2 += DY / 2
            return [...prev]
          })
        } else if (XR && rangY) { // right
          console.log('right');
          console.log(lastX, lastY);
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x2 += DX / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x2 += DX / 2
            return [...prev]
          })
        } else if (XL && rangY) { // lefft
          console.log('left');
          console.log(lastX, lastY);
          setPaths(prev => {
            prev[prev.length - 1].pos[0].x1 += DX / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].x1 += DX / 2
            return [...prev]
          })
        } else if (rangX && YB) { // bottom
          console.log('bottom');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].y2 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].y2 += DY / 2
            return [...prev]
          })
        } else if (rangX && YT) { // top
          console.log('top');
          setPaths(prev => {
            prev[prev.length - 1].pos[0].y1 += DY / 2
            return [...prev]
          })
          setSelect(prev => {
            prev[0].pos[0].y1 += DY / 2
            return [...prev]
          })
        } else {


          setPaths(prev => {
            const { startX, endX, startY, endY } = lastPos.current
            const A = startX - x1
            const B = startY - y1
            const C = x2 - startX
            const D = y2 - startY
            prev[idChoose].pos = [{ x1: endX - A, y1: endY - B, x2: endX + C, y2: endY + D }]
            return [...prev];
          })

          setSelect(prev => {
            prev[0].pos = [{ x1: x1 + DX - (prev[0].size), y1: y1 + - (prev[0].size), x2: x2 + DX + (prev[0].size), y2: y2 + DY + (prev[0].size) }]
            return prev;
          })
        }
      }
    } else {

      let shift = keyCode[0] == 16 ? true : false
      const { x1, y1 } = paths[paths.length - 1].pos[0];
      let pos;

      if (type === 'brush') {
        pos = { x: last.x, y: last.y }

        setPaths((prev) => {
          const temp = prev[prev.length - 1].pos
          prev[prev.length - 1].pos = [...temp, { x: last.x, y: last.y }]
          return [...prev]
        })
      } else if (type === 'connect') {

        // setPaths((prev) => {
        //   const temp = prev[prev.length - 1].pos
        //   prev[prev.length - 1].pos = [...temp, { x1, y1, x2: last.x, y2: last.y }]
        //   return [...prev]
        // })
      } else {
        if (type === 'move') {

          //loop all the object 

          const { x1, y1, x2, y2 } = paths[idChoose].pos[0]
          const CDx = lastPos.current.startX - x1
          const CDy = lastPos.current.startY - y1

          // setPaths(prev => {
          //   console.log(prev[idChoose].pos)
          //   // const {x1,y1,x2,y2} = prev[idChoose].pos[0]

          //   console.log('dx:', DX, 'dy:', DY)
          //   console.log('x1:', x1);
          //   console.log('x2:', x2);
          //   console.log('y1:', y1);
          //   console.log('y2:', y2);
          //   const { startX, endX, startY, endY } = lastPos.current
          //   const A = startX - x1
          //   const B = startY - y1
          //   const C = x2 - startX
          //   const D = y2 - startY
          //   console.log(537, A, B, C, D);
          //   console.log(x1, y1, x2, y2)
          //   console.log(x1 + DX);
          //   // prev[idChoose].pos=[{x1:lastPos.current.endX - CDx  , y1:lastPos.current.endY - CDy, x2 :lastPos.current.endX + x2 - lastPos.current.startX, y2: lastPos.current.endY + y2-lastPos.current.startY}]
          //   prev[idChoose].pos = [{ x1: endX - A, y1: endY - B, x2: endX + C, y2: endY + D }]
          //   return [...prev];
          // })

          // setSelect(prev => {
          //   prev[0].pos = [{ x1: x1 + DX - (prev[0].size), y1: y1 + - (prev[0].size), x2: x2 + DX + (prev[0].size), y2: y2 + DY + (prev[0].size) }]
          //   return prev;
          // })

        } else {

          if (type === 'eraser') {

          } else if (type === 'rect') {
            pos = [{ x1, y1: shift ? x1 : y1, x2: last.x, y2: shift ? last.x : last.y }]
          } else if (type === 'circle') {
            pos = [{ x1, y1: shift ? x1 : y1, x2: last.x, y2: shift ? last.x : last.y }]
          } else if (type === 'stroke') {
            pos = [{ x1, y1, x2: last.x, y2: last.y }]
          }


          setPaths(prev => {
            prev[prev.length - 1].pos = pos
            return [...prev];
          })
        }
      }
    }
  }

  const endDrawing = () => {
    setDrawing(false)
    // lastPos.current={}
  }

  const onMouseLeave = (e) => {

  }

  function redraw() {
    // console.log(paths);
    ctx.current.fillStyle = bgColor
    ctx.current.lineCap = "round"
    ctx.current.lineJoin = "round"
    ctx.current.fillRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height);

    if (paths.length > 0) {
      paths.forEach(p => {
        // console.log(p)
        if (p.type == 'rect') {
          makeRect(ctx.current, p)
        } else if (p.type == 'circle') {
          makeCircle(ctx.current, p)
        } else if (p.type == 'stroke') {
          makeStroke(ctx.current, p)
        } else if (p.type == 'brush') {
          makePath(ctx.current, p)
        } else if (p.type == 'connect') {

          makeConnectLine(ctx.current, p)
        }
      })
    }
    console.log(selects)
    if (selects.length > 0) {
      console.log('select: ', selects);
      makeRect(ctx.current, selects[0])


    }
  }

  useEffect(() => {
    if (type !== 'move') {
      setSelect([])
    }
  }, [type])
  useEffect(() => {
    redraw()
    var image = new Image()
    var img = ctx.current.canvas.toDataURL("image/jpeg");
    image.src = img
    const fav = document.getElementById('favicon');
    fav.href = img
  }, [bgColor, paths, selects])

  useEffect(() => {
    ctx.current.lineCap = "round"
    ctx.current.lineJoin = "round"
    ctx.current.strokeStyle = color
    ctx.current.fillStyle = fillColor
    ctx.current.lineWidth = size
  }, [color, size, fillColor])


  useEffect(() => {
    console.log(keyCode);
    if (keyCode.length > 0) {
      if (keyCode[0] === 17 && keyCode[1] === 13) {
        if (paths[paths.length - 1].type === 'connect') {
          setPaths(prev => {
            prev[prev.length - 1].pos.push({ x: prev[prev.length - 1].pos[0].x, y: prev[prev.length - 1].pos[0].y })
            return [...prev]
          })
        }
        setKeyCode([])
      } else if (keyCode[0] === 17 && keyCode[1] === 90) {
        const temp = [...paths]
        temp.pop()
        setPaths()
      } else if (keyCode[0] === 46 && keyCode.length === 1) {
        paths.forEach((p, i) => {
          console.log(671, i, p)
          if (p.choose === true) {
            console.log('choose :', i)
            const temp = [...paths]
            temp.pop()
            // const temp  = paths.pop()
            setPaths(temp)
            setSelect([])
          }
        })
      }

    }
  }, [keyCode, paths])
  useEffect(() => {
    const keydown = (e) => {
      // console.log(415, keyCode, paths);
      setKeyCode(prev => {
        const check = prev.findIndex(p => p === e.keyCode)
        // console.log(check);
        if (check == -1) {
          return [...prev, e.keyCode]
        } else {
          return [...prev]
        }
      })
    }
    const keyup = (e) => {
      setKeyCode([])
    }
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyup)

    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('keyup', keyup)
    }
  })
  const downlaod_img = (el) => {
    // get image URI from canvas object
    //  var imageURI = ctx.current.canvas.toDataURL("image/jpg");
    //  el.href = imageURI;
    var image = new Image()
    var img = ctx.current.canvas.toDataURL();
    const a = document.createElement('a')
    a.href = img;
    a.download = `favicon.${codec}`;
    a.click();
  }

  const clearRect = () => {
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
    setPaths([])
  }

  const undo = () => {
    const temp = [...paths]
    temp.pop()
    setPaths(temp)
  }
  //   useEffect(() => {
  //  if(selects.length > 0){


  //    setBoxTools(<div className='box-tool'>
  //    <div className='tool-row'>

  //      <label htmlFor='stroke-size'>STROKE SIZE: </label>
  //      <input
  //        id='slider' type="range" min="0" max="50"
  //        className="slider"
  //        defaultValue={size}
  //        onChange={(e) => setSize(e.target.value)}
  //        onMouseUp={(e) => setSize(e.target.value)}
  //      />

  //    </div>
  //      <div className='tool-row'>
  //        <>
  //          <label htmlFor='stroke-color'>STROKE: </label>
  //          <input
  //            type='color'
  //            className="color-picker"
  //            ref={colorRef}
  //            value={color} onChangeCapture={(e) => setColor(e.target.value)}
  //            colorformat="rgba"
  //          />
  //        </>
  //          <>
  //            <label htmlFor='fill-color'>FILL: </label>
  //            <input
  //              type='color'
  //              className="color-picker"
  //              ref={fillColorRef}
  //              value={fillColor}
  //              onChangeCapture={(e) => setFillColor(e.target.value)}
  //            />
  //          </> 
  //      </div>
  //  </div>)
  //  }
  //   }, [selects])
  return (
    <div className="App">
      {selects.length > 0 && <BoxTools path={paths[paths.length -1]} setPaths={setPaths}/>}
      <NavBar
        navRef={navRef}
        fillColor={fillColor}
        fillColorRef={fillColorRef}
        setFillColor={setFillColor}
        clearRect={clearRect}
        setType={setType}
        type={type}
        setColor={setColor}
        colorRef={colorRef}
        ctx={ctx}
        color={color}
        bgColor={bgColor}
        setBgColor={setBgColor}
        setSize={setSize}
        size={size}
        setCodec={setCodec}
        setResolution={setResolution}
        codec={codec}
        resolution={resolution}
        undo={undo}
      />
      <h1> FAVICION EASLY </h1>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        ref={canvasRef}
        onKeyPressCapture={(e) => setKeyCode(e)}
        onMouseDown={startDrawing}
        mouseOver={mouseOver}
        onMouseMove={onDraw}
        onMouseUp={endDrawing}
        onMouseLeave={(e) => onMouseLeave(e)}
      >
      </canvas>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <div id="download" style={{ width: CANVAS_WIDTH }} onClick={() => {
          downlaod_img()
        }}>download</div>
      </div>
      <div className='img-bg'></div>

    </div>
  );
}

export default App;

import { useState, useEffect } from 'react'
import './App.css'
import Testing from './component/Test'

const images = [
  "/logo1.png",
  "/logo2.png",
  "/logo3.png",
  "/logo4.png",
  "/logo5.png"
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() =>{
    const handleKeyDown = (e)=>{
      if (e.code === 'Space') {
        e.preventDefault() // 

        setActiveIndex((prev) =>
          (prev + 1) % images.length
        )
      }
    }
    window.addEventListener('keydown',handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  },[])

  return (
    <>
    <button>hello</button>
    <Testing />

     <div className="icon-row">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className={index === activeIndex ? 'icon active' : 'icon'}
        />
      ))}
    </div>
    </>
  )

  
}


export default App

function GuideScreen() {
  return (
    <div className="guide-screen">
      <h1>Guide</h1>

      <div className="guide-box">
        <p>Click Space：Swap a Card</p>
        <p>Double Click Space：Play a Card</p>
        <p>Hold Space：End This Turn</p>
      </div>

      <p className="story-hint">Press space to start battle</p>
    </div>
  )
}

export default GuideScreen

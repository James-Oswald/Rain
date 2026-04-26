function StoryScreen({ displayText }) {
  return (
    <div className="story-screen">
      <p className="story-text">{displayText}</p>
      <p className="story-hint">press space to continue</p>
    </div>
  )
}

export default StoryScreen

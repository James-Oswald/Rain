function TextScreen({
  title,
  text,
  hint = 'press space to continue',
  choices,
  selectedChoice
}) {
  return (
    <div className="ending-screen">
      {title && <h1>{title}</h1>}

      {text && <p>{text}</p>}

      {choices && (
        <div className="choice-box">
          {choices.map((choice, index) => (
            <p
              key={index}
              className={
                selectedChoice === index
                  ? 'choice selected-choice'
                  : 'choice'
              }
            >
              {choice}
            </p>
          ))}
        </div>
      )}

      <p className="story-hint">{hint}</p>
    </div>
  )
}

export default TextScreen
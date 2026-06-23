import PropTypes from "prop-types"

function ImageUploadPresentation({
  handelFormSubmit,
  handelUserInput,
  handleImageChange,
  preViewImage,
  type,
  name,
  year,
  imageName,
  eventSuggestions,
  onSuggestionSelect,
}) {
  const subject = type === "EVENT" ? "event" : type === "CAMPUS" ? "place" : "department"

  return (
    <main className="admin-content admin-upload-page">
      <section className="admin-heading">
        <div><span>Archive editor</span><h1>Add a photograph</h1><p>Upload an image and add enough context for visitors to understand it.</p></div>
      </section>
      <form onSubmit={handelFormSubmit} className="upload-card">
        <label className="upload-dropzone" htmlFor="imageUpload">
          {preViewImage ? <img src={preViewImage} alt="Selected upload preview" /> : <div><strong>Choose a photograph</strong><span>JPG, PNG, or WebP</span></div>}
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
        </label>
        <div className="form-panel upload-form">
          <span className="eyebrow">{type?.toLowerCase()} collection</span>
          {type === "EVENT" && (
            name ? (
              <p className="upload-form__year">Event year: <strong>{year || "Not specified"}</strong></p>
            ) : (
              <>
                <label htmlFor="EventYear">Event year</label>
                <input id="EventYear" name="EventYear" type="number" min="1960" max="2100" placeholder={String(new Date().getFullYear())} required onChange={handelUserInput} />
              </>
            )
          )}
          {!name ? (
            <>
              <label htmlFor="ImageName">Name of the {subject}</label>
              <input id="ImageName" name="ImageName" type="text" value={imageName} required minLength={3} maxLength={40} autoComplete="off" onChange={handelUserInput} />
              {type === "EVENT" && eventSuggestions.length > 0 && (
                <div className="event-suggestions">
                  <span>Existing events for this year</span>
                  {eventSuggestions.map((event) => (
                    <button type="button" key={event._id} onClick={() => onSuggestionSelect(event.eventName)}>
                      <strong>{event.eventName}</strong>
                      <small>{event.year || "Year not specified"} · {(event.image || []).length} photos</small>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : <h2>{name}</h2>}
          <label htmlFor="ImageDescription">Photograph description</label>
          <textarea id="ImageDescription" name="ImageDescription" rows="6" required onChange={handelUserInput} />
          <button type="submit" className="button button--primary">Upload photograph</button>
        </div>
      </form>
    </main>
  )
}

ImageUploadPresentation.propTypes = {
  handelFormSubmit: PropTypes.func.isRequired,
  handelUserInput: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  preViewImage: PropTypes.string,
  type: PropTypes.oneOf(["EVENT", "CAMPUS", "DEPARTMENT"]),
  name: PropTypes.string,
  year: PropTypes.number,
  imageName: PropTypes.string.isRequired,
  eventSuggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSuggestionSelect: PropTypes.func.isRequired,
}

export default ImageUploadPresentation

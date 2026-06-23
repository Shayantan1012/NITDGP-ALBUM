import PropTypes from "prop-types"

export function LoadingState({ message = "Loading the album…" }) {
  return (
    <div className="page-state" role="status">
      <span className="page-state__spinner" />
      <p>{message}</p>
    </div>
  )
}

export function EmptyState({ title, message, onRetry }) {
  return (
    <div className="page-state">
      <div className="page-state__icon">✦</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button type="button" className="button button--primary" onClick={onRetry}>Try again</button>}
    </div>
  )
}

LoadingState.propTypes = { message: PropTypes.string }
EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
}

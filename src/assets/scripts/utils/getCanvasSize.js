const getCanvasSize = wrapperId => {
  const el = document.getElementById(wrapperId).getBoundingClientRect()

  if (el)
    return {
      height: el.height,
      width: el.width,
    }

  return null
}

export default getCanvasSize

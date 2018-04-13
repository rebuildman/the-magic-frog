export default () => {
  if (process.env.NODE_ENV !== 'production') return

  window.addEventListener("load", function() {
    window.cookieconsent.initialise({
      "palette": {
        "popup": {
          "background": "#efefef",
          "text": "#404040"
        },
        "button": {
          "background": "#557f00"
        }
      },
      "theme": "classic",
      "content": {
        "message": "The frog gave you a magic cookie to make you feel good! (And to keep you logged in...)",
        "dismiss": "Cool! Thanks!",
        "link": "A magic cookie?"
      }
    })
  });
}
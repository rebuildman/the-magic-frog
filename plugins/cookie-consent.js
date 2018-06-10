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
        "message": $t("cookie.message"),
        "dismiss": $t("cookie.dismiss"),
        "link": $t("cookie.link")
      }
    })
  });
}

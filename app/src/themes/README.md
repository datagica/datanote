# /themes

Some global stylesheets and Material UI style

Right now, many styles are defined in each react component.

This makes things easier when iterating over thr design of components, but isn't
great in term of UI and UX consistency because this can lead to variations in
colors and style.

Whenever possible, we should try to find a common color scheme, font size etc..
and define this theme in `lightTheme.js`, to have less custom style in components.

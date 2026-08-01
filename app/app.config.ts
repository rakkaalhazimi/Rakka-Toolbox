export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },

    button: {
      variants: {
        size: {
          '2xl': {
            base: 'px-5 py-5 text-base gap-2',
            leadingIcon: 'size-6',
            leadingAvatarSize: 'xs',
            trailingIcon: 'size-6'
          }
        }
      }
    }
  }
})

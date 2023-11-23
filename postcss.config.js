export default {
  plugins: 
    process.env.NODE_ENV == 'development' ? { tailwindcss: {} }
			: { tailwindcss: {}, autoprefixer: {}, cssnano: { preset: 'default', } }
  ,
}

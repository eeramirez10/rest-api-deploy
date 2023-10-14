const z = require('zod')

const movieEsquema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a String',
    required_error: 'Movie Title is required'
  }),
  year: z.number().int().min(1900).max(2023),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string({ required_error: 'URl is required' }).url(),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime']),
    {
      required_error: 'Movie genre is require',
      invalid_type_error: 'Movie genre must be an array of enum genre'
    }
  )
})

const validateMovie = (object) => {
  return movieEsquema.safeParse(object)
}

const validatePartialMovie = (object) => {
  return movieEsquema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}

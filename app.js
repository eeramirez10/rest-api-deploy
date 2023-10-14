const express = require('express')
const app = express()
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movie')

app.disable('x-powered-by')

app.use(express.json())

app.get('/movies', (req, res) => {
  const { genre } = req.query

  const moviesByGenre = genre ? movies.filter(movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase())) : movies
  if (moviesByGenre.length > 0) return res.json(moviesByGenre)

  return res.status(404).json({ message: 'Peliculas no encontradas' })
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const searchedMovie = movies.find(movies => movies.id === id)

  if (searchedMovie) return res.json(searchedMovie)

  return res.status(404).json({ message: 'Pelicula no encontrada' })
})

app.post('/movies', (req, res) => {
  console.log(req.body)
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  return res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params

  console.log(req.body)

  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: 'Hubo un error al validar' })
  }
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Pelicula no encontrada' })

  const newMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  console.log(newMovie)

  movies[movieIndex] = { ...newMovie }

  return res.json(newMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})

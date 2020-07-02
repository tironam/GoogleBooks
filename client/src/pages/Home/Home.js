import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140, 
    },
})

const Home = () => {

    const classes = useStyles()

    const [bookState, setBookState] = useState({
        search: '',
        books: []
    })

    bookState.handleInputChange = event => {
        setBookState({ ...bookState, [event.target.name]: event.target.value })
    }

    bookState.handleSearchBook = event => {
        event.preventDefault()
        axios.get(`/api/books/${bookState.search}`)
            .then(({ data }) => {
                console.log(data)
                setBookState({ ...bookState, books: data})
            })
            .catch(err => console.error(err))
    }

    bookState.handleSaveBook = book => {
        axios.post('/api/books', {
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors[0],
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks.smallThumbnail,
            link: book.volumeInfo.infoLink,
            bookId: book.id
        })
        .then(() => {
            const books = bookState.books
            const booksFiltered = books.filter(novel => novel.id !== book.id)
            setBookState({ ...bookState, books: booksFiltered })
        })
        .catch(err => console.error(err))
    }
    
    return (
        <>
            <form onSubmit={bookState.handleSearchBook}>
                <TextField
                    label="Search Books"
                    name="search"
                    value={bookState.search}
                    onChange={bookState.handleInputChange} />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={bookState.handleSearchBook}>
                    Search
                </Button>
            </form>
            <div>
                {
                    bookState.books.map(book => (
                        <Card className={classes.root}>
                            <CardHeader
                                title={book.title}
                                subheader={book.authors.length ? `Written by ${book.authors}` : 'Author unknown'}
                            />
                            <CardMedia
                                className={classes.media}
                                image={book.volumeInfo.imageLinks.smallThumbnail}
                                title={book.title}
                            />
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={()=> bookState.handleSaveBook(book)}>
                                        Save
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}

export default Home
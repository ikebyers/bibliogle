import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import type { Book } from '../models/Book';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [saveBook] = useMutation(SAVE_BOOK);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }
      const { items } = await response.json();

      const bookData = items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['No author to display'],
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch books. Please try again later.');
    }
  };

  const handleSaveBook = async (bookId: string) => {
    // Find the book in the searchedBooks state
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
  
    if (!bookToSave) {
      console.error(`Book with ID ${bookId} not found.`);
      return;
    }
  
    try {
      // Call the saveBook mutation with the bookToSave object
      const { data } = await saveBook({
        variables: {
          input: {
            bookId: bookToSave.bookId,
            title: bookToSave.title,
            authors: bookToSave.authors,
            description: bookToSave.description,
            image: bookToSave.image,
            link: bookToSave.link,
          },
        },
      });
  
      if (!data) {
        throw new Error('Failed to save book!');
      }

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err: any) {
      if (err.networkError) {
        console.error('Network Error:', err.networkError);
      }
      if (err.graphQLErrors) {
        console.error('GraphQL Errors:', err.graphQLErrors);
      }
      console.error('Failed to save the book:', err);
      setErrorMessage('Failed to save book. Please try again.');
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId: string) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId: string) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;

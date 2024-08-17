import React, { createContext, useContext, useEffect, useState } from "react";

import useAxios from "../Hooks/useAxios";
import { BOOK_API_ENDPOINT } from "../Config/UserApiEndPoints";
import { NOTE_API_ENDPOINT } from "../Config/NotesApiEndPoints";

const BookCtxApi = createContext();

const useBookCtx = () => useContext(BookCtxApi);

const BookCtx = ({ children }) => {
  const [books, setBooks] = useState();
  const [allNotes, setAllNotes] = useState();
  const [selectedNote, setSelectedNote] = useState();

  const { axiosInstance, handleError, errorMsg, setErrorMsg } = useAxios();

  const createBook = async (payload) => {
    try {
      setErrorMsg("");

      await axiosInstance.post(BOOK_API_ENDPOINT, payload);
      getBooks();
    } catch (error) {
      handleError(error);
    }
  };

  const getBooks = async () => {
    try {
      const { data } = await axiosInstance.get(BOOK_API_ENDPOINT);

      setBooks(data);

      setErrorMsg("");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNote = async (payload) => {
    try {
      setErrorMsg("");

      await axiosInstance.post(NOTE_API_ENDPOINT, payload);

      getAllNotes(payload.book_id);
    } catch (error) {
      handleError(error);
    }
  };

  const getAllNotes = async (bookId) => {
    try {
      const { data } = await axiosInstance(NOTE_API_ENDPOINT + "?id=" + bookId);

      setAllNotes(data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <BookCtxApi.Provider
      value={{
        errorMsg,
        books,
        createBook,
        createNote,
        getAllNotes,
        allNotes,
        setSelectedNote,
        selectedNote,
      }}
    >
      {children}
    </BookCtxApi.Provider>
  );
};

export default BookCtx;
export { useBookCtx };

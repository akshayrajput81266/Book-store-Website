import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Order from "./Order";
import BASE_URL from "../utils/config.js";

function Course() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // AI Chat states
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBooks, setAiBooks] = useState([]);
  const [aiSearched, setAiSearched] = useState(false);

  const searchQuery = searchParams.get("search") || "";

  
  useEffect(() => {
    if (searchParams.get("ai") === "true") {
      setShowAIChat(true);
    }
  }, [searchParams]);

  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/book`);
        setBooks(res.data);
      } catch (error) {
        console.error("Books fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Normal search filter
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;
    return (
      book.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // AI Search handler
  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    try {
      setAiLoading(true);
      setAiSearched(false);
      const res = await axios.post(`${BASE_URL}/api/ai/search`, {
        query: aiQuery,
      });
      setAiBooks(res.data.books);
      setAiSearched(true);
    } catch (error) {
      console.error("AI search error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  
  const resetAISearch = () => {
    setAiBooks([]);
    setAiQuery("");
    setAiSearched(false);
    setShowAIChat(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const displayBooks = aiSearched ? aiBooks : filteredBooks;

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 mt-28">

      {/* AI Chat Search Button */}
      {!showAIChat && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAIChat(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 duration-200"
          >
            <span>✨</span>
            <span>Ask from AI</span>
          </button>
        </div>
      )}

      {/* AI Chat Box */}
      {showAIChat && (
        <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-bold">✨ AI Book Assistant</h3>
            </div>
            <button
              onClick={resetAISearch}
              className="text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAISearch} className="flex gap-3">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask any book... like 'romantic novel'"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-600 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-60 duration-200"
            >
              {aiLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Search"
              )}
            </button>
          </form>

          {/* Suggestion chips */}
          {!aiSearched && (
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Thriller books",
                "Free books",
                "Romantic novels",
                "Self help books",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiQuery(suggestion)}
                  className="text-xs bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded-full duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Results Heading */}
      {aiSearched && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              ✨ AI Results for:{" "}
              <span className="text-pink-500">"{aiQuery}"</span>
            </h2>
            <p className="text-gray-500 mt-1">
              {aiBooks.length} book{aiBooks.length !== 1 ? "s" : ""} recommend
              ki gayi
            </p>
          </div>
          <button
            onClick={resetAISearch}
            className="text-sm text-pink-500 hover:underline"
          >
            ← see all books
          </button>
        </div>
      )}

      {/* Normal Search Heading */}
      {searchQuery && !aiSearched && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            Search results for:{" "}
            <span className="text-pink-500">"{searchQuery}"</span>
          </h2>
          <p className="text-gray-500 mt-1">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
      )}

      {/* No Results */}
      {displayBooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400">book not found</p>
          <p className="text-gray-400 mt-2">Try something else.</p>
          <button
            onClick={resetAISearch}
            className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 duration-200"
          >
            see all Books 
          </button>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayBooks.map((book) => (
          <div
            key={book._id}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-slate-800 dark:text-white"
          >
            <figure className="h-48 overflow-hidden">
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <h3 className="card-title text-base font-bold line-clamp-2">
                {book.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {book.category}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-pink-500 font-bold">
                  {book.price === 0 ? "Free" : `$${book.price}`}
                </span>
                <Order item={book} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Course;
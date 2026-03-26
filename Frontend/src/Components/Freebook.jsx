import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

function Freebook() {
  const [book, setBook] = useState([]);
  
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get("http://localhost:4001/book");
        const data = res.data.filter((data) => data.category === "Free");
        setBook(data);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <h1 className="font-semibold text-xl pb-2">Free Offered Courses</h1>
      <div className="flex flex-wrap gap-4">
        {book.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

export default Freebook;
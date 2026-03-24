import React, { useEffect, useState } from "react";
import list from "../list.json";
import Cards from "./Card";

function Freebook() {
  const [book, setBook] = useState([]);

  useEffect(() => {
    const data = list.filter((item) => item.category === "Free");
    setBook(data);
  }, []);

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div>
          <h1 className="font-semibold text-xl pb-2">Free Offered Courses</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {book.map((item) => (
            <Cards item={item} key={item.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Freebook;
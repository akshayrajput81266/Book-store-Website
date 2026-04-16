import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import Book from "../model/book.model.js";

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const { query } = req.body;
    console.log("🔍 User Query:", query);

    // MongoDB se saari books fetch karo
    const books = await Book.find({});
    console.log("📚 Total books in DB:", books.length);
    console.log("📚 Sample book:", JSON.stringify(books[0], null, 2));

    // AI ko bhejo
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `
Tu ek bookstore assistant hai. Neeche books ki list hai JSON format mein.
User ne yeh query ki hai: "${query}"

Books List:
${JSON.stringify(books, null, 2)}

Task:
- User ki query ke hisaab se SIRF relevant books ke _id return karo
- Agar koi relevant book nahi hai toh empty array return karo
- Sirf JSON array return karo, kuch aur mat likho
- Format: ["id1", "id2", "id3"]
          `,
        },
      ],
    });

    const responseText = message.content[0].text.trim();
    console.log("🤖 AI Response:", responseText);

    const bookIds = JSON.parse(responseText);
    console.log("🔑 Book IDs from AI:", bookIds);

    // Un books ko filter karo
    const recommendedBooks = books.filter((book) =>
      bookIds.includes(book._id.toString())
    );
    console.log(" Recommended books count:", recommendedBooks.length);

    res.json({ books: recommendedBooks });
  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ message: "AI search failed", error: error.message });
  }
});

export default router;
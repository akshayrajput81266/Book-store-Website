import React, { useState } from "react";
import BASE_URL from "../utils/config.js";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};
  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email Us",
      value: "akshayrajput81266@gmail.com",
      href: "mailto:support@bookstore.com",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "Call Us",
      value: "+91 8126679914",
      href: "tel:+15550001234",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Our Location",
      value: "123 Book Lane,sector 62 ,Noida",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-slate-800 dark:text-white bg-base-100 pt-20">
      {/* Hero Banner */}
      <div className="bg-black text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          Contact <span className="italic font-light">Us</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info Cards */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold mb-2 border-b pb-2 dark:border-slate-600 border-gray-200">
              Get in Touch
            </h2>

            {contactInfo.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-start gap-4 p-5 rounded-xl border dark:border-slate-600 dark:bg-slate-700 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="p-2 bg-black text-white rounded-lg group-hover:scale-105 transition-transform duration-200">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-semibold text-sm dark:text-white text-gray-800 leading-snug">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className="mt-4">
              <p className="text-sm font-semibold mb-3 dark:text-gray-300 text-gray-600">
                Follow us on
              </p>
              <div className="flex gap-3">
                {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                  <button
                    key={s}
                    className="text-xs px-3 py-2 border dark:border-slate-600 dark:hover:bg-slate-600 border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200 font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-700 border dark:border-slate-600 border-gray-200 rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Send a Message</h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-black text-white px-5 py-2.5 rounded-md hover:bg-slate-800 duration-300 text-sm font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border dark:border-slate-500 dark:bg-slate-800 dark:text-white border-gray-300 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border dark:border-slate-500 dark:bg-slate-800 dark:text-white border-gray-300 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors duration-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full px-4 py-2.5 border dark:border-slate-500 dark:bg-slate-800 dark:text-white border-gray-300 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors duration-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-300 text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 border dark:border-slate-500 dark:bg-slate-800 dark:text-white border-gray-300 rounded-lg outline-none focus:border-black dark:focus:border-white transition-colors duration-200 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-slate-800 duration-300 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Strip */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express options are available at checkout." },
              { q: "Can I return a book?", a: "Yes! Returns are accepted within 14 days of delivery for books in original condition." },
              { q: "Do you offer digital books?", a: "Absolutely. Most titles are available as eBooks and can be downloaded instantly after purchase." },
              { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking number via email to monitor your delivery in real time." },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl border dark:border-slate-600 dark:bg-slate-700 border-gray-200 bg-white">
                <p className="font-semibold text-sm mb-1.5">{faq.q}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
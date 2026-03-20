import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [tone, setTone] = useState("Bold");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tweets")
  const [copied, setCopied] = useState(null);

  const [result, setResult] = useState({
    tweets: [],
    linkedin: "",
    email: { subject: "", body: "" }
  });

  const handleCopy = async () => {
  let text = "";

  if (activeTab === "tweets") {
    text = result.tweets?.join("\n\n");
  } else if (activeTab === "linkedin") {
    text = result.linkedin;
  } else if (activeTab === "email") {
    text = `${result.email?.subject}\n\n${result.email?.body}`;
  }

  await navigator.clipboard.writeText(text);

  setCopied(activeTab);
  setTimeout(() => setCopied(null), 1500);
};

  const handleGenerate = async () => {
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("file", file);
    else formData.append("content", content);

    formData.append("tone", tone);
    formData.append("types", JSON.stringify(["tweets", "linkedin", "email"]));

    const res = await fetch("https://ai-content-repurposing.onrender.com/generate", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      alert("Backend failed. Check console.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleRegenerate = async (type) => {
    setLoading(true);

    const formData = new FormData();
    if (file) formData.append("file", file);
    else formData.append("content", content);

    formData.append("tone", tone);
    formData.append("types", JSON.stringify([type]));
    formData.append(
      "variation_instruction",
      "Generate a completely different version with a new angle and hook."
    );

    const res = await fetch("https://ai-content-repurposing.onrender.com/generate", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setResult(prev => ({
      ...prev,
      ...data
    }));

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white flex justify-center p-6"
    >
      <div className="w-full max-w-5xl space-y-6">

        {/* HEADER */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center"
        >
          AI Content Repurposer
        </motion.h1>

        {/* INPUT CARD */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <textarea
            placeholder="Paste your blog, idea, or content..."
            className="w-full p-4 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* FILE */}
          <label className="block cursor-pointer border border-dashed border-white/30 p-4 rounded-xl text-center hover:bg-white/10 transition">
            {file ? file.name : "Upload PDF (optional)"}
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected && selected.type !== "application/pdf") {
                  alert("Only PDF files allowed");
                  return;
                }
                setFile(selected);
              }}
            />
          </label>

          <div className="flex justify-between items-center">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="bg-black/40 border border-white/20 px-4 py-2 rounded-lg"
            >
              <option>Bold</option>
              <option>Casual</option>
              <option>Professional</option>
              <option>Storytelling</option>
            </select>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleGenerate}
              className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-lg font-semibold"
            >
              {loading ? "Generating..." : "Generate"}
            </motion.button>
          </div>
        </motion.div>

        {/* OUTPUT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          {/* TABS */}
          <div className="flex gap-3 mb-4">
            {["tweets", "linkedin", "email"].map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "bg-white/10"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">

            <AnimatePresence mode="wait">

              {/* TWEETS */}
              {activeTab === "tweets" && (
                <motion.div
                  key="tweets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {result.tweets?.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-lg bg-black/40 border border-white/10"
                    >
                      {t}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* LINKEDIN */}
              {activeTab === "linkedin" && (
                <motion.div
                  key="linkedin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-black/40 border border-white/10"
                >
                  {result.linkedin?.split("\n").map((line, i) => (
                    <p key={i} >
                      {line}
                    </p>
                  ))}
                </motion.div>
              )}

              {/* EMAIL */}
              {activeTab === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-black/40 border border-white/10"
                >
                  <h3 className="font-bold text-lg mb-2">
                    {result.email?.subject}
                  </h3>

                  {result.email?.body?.split("\n").map((line, i) => (
                    <p key={i} className="mb-2 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* REGENERATE */}
          {/* ACTION BUTTONS */}
        <div className="mt-4 flex justify-between items-center">

          {/* COPY BUTTON */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {copied === activeTab ? "✔ Copied" : "📋 Copy"}
          </motion.button>

          {/* REGENERATE */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRegenerate(activeTab)}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            Regenerate {activeTab}
          </motion.button>

        </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

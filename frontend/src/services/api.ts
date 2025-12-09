const API_URL = "http://127.0.0.1:8000/api/v1";

export const generateTrack = async (prompt: string) => {
  try {
    const res = await fetch(`${API_URL}/music/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration: 30 }),
    });
    if (!res.ok) throw new Error("Generation failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/music/history`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

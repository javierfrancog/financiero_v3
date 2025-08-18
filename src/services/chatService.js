const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;


export async function sendMessageToGPT(messages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// FUNCI�"N para el módulo "manual"
export async function sendManualPrompt(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.0, // muy preciso
      max_tokens: 20,
      messages: [
        {
          role: "system",
          content: `Devuelve estrictamente solo el ID del tema más relevante del manual. No expliques nada. Devuelve solo un texto como: crear_usuario o enviar_factura. Si no hay coincidencias, responde: ninguno.`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Respuesta OpenAI:", data);
  return data.choices?.[0]?.message?.content?.trim().toLowerCase();
}


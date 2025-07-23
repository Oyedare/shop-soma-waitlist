export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    email_address_check = "",
    locale = "en",
    html_type = "simple",
    token, // reCAPTCHA token
  } = req.body;

  if (!firstName || !lastName || !email || !token) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("FIRSTNAME", firstName);
    formData.append("LASTNAME", lastName);
    formData.append("EMAIL", email);
    formData.append("email_address_check", email_address_check);
    formData.append("locale", locale);
    formData.append("html_type", html_type);
    formData.append("g-recaptcha-response", token);

    const response = await fetch(
      "https://0fc5180e.sibforms.com/serve/MUIFAAkTXNSnxSMVINcph_7c-yv8X1w_VyfpCqu-1ciY199sIkXcGGy8IupuBv-myaky8kaWcLj4mVI4ZZZAJsgeewC7_yhNdemgErNK1mRVac21ddNudyxbtGlx3nCqO4EPc3_XIqgzxFp_Q5YK2RhKf3ebdHeSXvF_irbqPSS80B_kQszMVj7X5Setuqg2fJCmRY03Na0fyppA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      throw new Error("Brevo submission failed");
    }

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error("Error submitting to Brevo:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

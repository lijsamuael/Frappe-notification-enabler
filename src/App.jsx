import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegramUserId, setTelegramUserId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Login the user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/method/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usr: email, pwd: password }),
        }
      );

      if (response.ok) {
        await response.json();
        setLoggedInUser(email);
        setMessage("Login successful!");
        updateTelegramUserId();
      } else {
        setMessage("Invalid email or password");
      }
    } catch (error) {
      setMessage("Error during login: " + error.message);
    }
  };

  // Get Telegram user ID from Telegram WebApp
  const getTelegramUserId = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
      setTelegramUserId(userId || "");
    } else {
      setMessage("Telegram WebApp is not available");
    }
  };

  const updateTelegramUserId = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/resource/User/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${import.meta.env.VITE_APP_API_KEY}:${
              import.meta.env.VITE_APP_API_SECRET
            }`,
          },
          body: JSON.stringify({ telegram_user_id: telegramUserId }),
        }
      );

      if (response.ok) {
        setMessage("Notification enabled!");
        setShowMessage(true);

        // Close app after showing success message
        setTimeout(() => {
          window.Telegram.WebApp.close();
        }, 3000);
      } else {
        setMessage("Failed to update Telegram User ID");
      }
    } catch (error) {
      setMessage("Error updating Telegram User ID: " + error.message);
    }
  };

  useEffect(() => {
    getTelegramUserId();
  }, []);

  return (
    <section className="">
      {!loggedInUser ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0"
        >
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-full h-24 mr-2" src="/logo.jpg" alt="logo" />
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      ) : (
        showMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white bg-green-500 p-4 rounded-lg shadow-md"
          >
            {message}
          </motion.div>
        )
      )}
    </section>
  );
}

export default App;

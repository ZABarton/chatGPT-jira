import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [description, setDescriptionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: description }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.log(data.result)
      setDescriptionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Jira-vision</title>
        <link rel="icon" href="/thinking.png" />
      </Head>

      <main className={styles.main}>
        <img src="/thinking.png" className={styles.icon} />
        <h3>Let's Make A Jira Ticket</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="description"
            placeholder="A Description Goes Here"
            value={description}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />
          <input type="submit" value="Hit me one time" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}

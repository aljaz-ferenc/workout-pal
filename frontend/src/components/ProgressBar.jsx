import { motion } from "framer-motion";

export function ProgressBar({ color, duration }) {
  return (
    <div style={{ height: "5px", width: "100%" }}>
      <motion.div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: color,
        }}
        initial={{ width: "0%" }}
        animate={{
          width: "100%",
          transition: { duration: duration || 1, ease: "easeInOut" },
        }}
      ></motion.div>
    </div>
  );
}
